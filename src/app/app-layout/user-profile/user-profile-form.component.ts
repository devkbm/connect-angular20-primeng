import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { catchError, of, switchMap } from 'rxjs';

import { ResponseObject } from 'src/app/core/model/response-object';

/*
import { HlmFormFieldModule } from '@spartan-ng/helm/form-field';
import { HlmInput } from '@spartan-ng/helm/input';
*/

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseList } from 'src/app/core/model/response-list';
import { SessionManager } from 'src/app/core/session-manager';



@Component({
  selector: 'app-user-profile-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    /*
    HlmFormFieldModule,
    HlmInput
    */
],
  template: `
    <form [formGroup]="fg" class="space-y-6">
      <!-- 폼 오류 메시지 템플릿 -->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
        @if (control.hasError('exists')) {
          기존 코드가 존재합니다.
        }
      </ng-template>

      {{this.fg.value |json}}

      <!--
      <hlm-form-field>
        사용자ID
        <input class="w-50" hlmInput id="userId" formControlName="userId" required />
        <hlm-hint>사용자 아이디를 확인해주세요.</hlm-hint>
        <hlm-error>필수 입력 값입니다.</hlm-error>
      </hlm-form-field>

      <hlm-form-field>
        기존 비밀번호
        <input class="w-50" hlmInput id="beforePassword" formControlName="beforePassword" required />
        <hlm-hint>기존 비밀번호를 입력해주세요.</hlm-hint>
        <hlm-error>필수 입력 값입니다.</hlm-error>
      </hlm-form-field>

      <hlm-form-field>
        변경 비밀번호
        <input class="w-50" hlmInput id="afterPassword" formControlName="afterPassword" required />
        <hlm-hint>변경 비밀번호를 입력해주세요.</hlm-hint>
        <hlm-error>필수 입력 값입니다.</hlm-error>
      </hlm-form-field>

      <hlm-form-field>
        변경 비밀번호 확인
        <input class="w-50" hlmInput id="afterPasswordConfirm" formControlName="afterPasswordConfirm" required />
        <hlm-hint>변경 비밀번호를 한번 더 입력해주세요.</hlm-hint>
        <hlm-error>필수 입력 값입니다. </hlm-error>
      </hlm-form-field>
      -->

      <!--
      <nz-form-item-custom for="userId" label="사용자ID" required="true">
        <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
          <input nz-input id="userId" formControlName="userId" required
          />
        </nz-form-control>
      </nz-form-item-custom>

      <nz-form-item-custom for="beforePassword" label="기존 비밀번호">
        <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
          <input nz-input id="beforePassword" formControlName="beforePassword" required
            placeholder="기존 비밀번호를 입력해주세요."
          />
        </nz-form-control>
      </nz-form-item-custom>

      <nz-form-item-custom for="afterPassword" label="변경 비밀번호">
        <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
          <input nz-input id="afterPassword" formControlName="afterPassword" required
            placeholder="변경 비밀번호를 입력해주세요."
          />
        </nz-form-control>
      </nz-form-item-custom>

      <nz-form-item-custom for="afterPasswordConfirm" label="변경 비밀번호 확인">
        <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
          <input nz-input id="afterPasswordConfirm" formControlName="afterPasswordConfirm" required
            placeholder="변경 비밀번호를 한번 더 입력해주세요."
          />
        </nz-form-control>
      </nz-form-item-custom>
    </form>

    <button nz-button nzType="primary" (click)="passwordChange()">
      <span nz-icon nzType="save" nzTheme="outline"></span>변경
    </button>
      -->
  `
})
export class UserProfileFormComponent {

  private http = inject(HttpClient);

  fg = inject(FormBuilder).group({
    userId          : new FormControl<string | null>(null, { validators: [Validators.required] }),
    beforePassword  : new FormControl<string | null>(null, { validators: [Validators.required] }),
    afterPassword   : new FormControl<string | null>(null, { validators: [Validators.required] }),
    afterPasswordConfirm : new FormControl<string | null>(null, { validators: [Validators.required] }),
  });

  constructor() {
    this.fg.controls.userId.setValue(SessionManager.getUserId());
  }

  passwordChange() {
    if (this.fg.invalid) {
      Object.values(this.fg.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const val = {
      userId: this.fg.controls.userId.value,
      beforePassword: this.fg.controls.beforePassword.value,
      afterPassword: this.fg.controls.afterPassword.value
    }

    const url =  GlobalProperty.serverUrl() + `/api/system/user/${this.fg.controls.userId.value}/changepassword`;
    const options = getHttpOptions();

    this.http.post<ResponseObject<boolean>>(url, val, options).pipe(
          //catchError(this.handleError<ResponseObject<BizCode>>('save', undefined))
        )
        .subscribe(
          (model: ResponseObject<boolean>) => {

          }
        )
  }
}
