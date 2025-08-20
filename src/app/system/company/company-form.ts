import { Component, Renderer2, effect, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { NotifyService } from 'src/app/core/service/notify.service';
import { ResponseObject } from 'src/app/core/model/response-object';

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';


export interface Company {
  /**
   * 회사코드
   */
  companyCode: string | null;
  /**
   * 회사명
   */
  companyName: string | null;
  /**
   * 사업자등록번호
   */
  businessRegistrationNumber: string | null;
  /**
   * 법인번호
   */
  coporationNumber: string | null;
  /**
   * 대표자
   */
  nameOfRepresentative: string | null;
  /**
   * 설립일
   */
  establishmentDate: Date | null;
}


@Component({
  selector: 'app-company-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    MessageModule
],
  template: `
    {{fg.getRawValue()| json}} - {{fg.valid}}

    <div class="card flex">

    <form [formGroup]="fg" class="flex flex-col gap-6 w-full sm:w-56">
      <!-- 폼 오류 메시지 템플릿 -->
      <ng-template #errorTpl let-control>
        @if (control.hasError('required')) {
          필수 입력 값입니다.
        }
        @if (control.hasError('exists')) {
          기존 코드가 존재합니다.
        }
      </ng-template>

      <div class="flex flex-col gap-1">
        <p-floatlabel>
          <input id="companyCode" pInputText formControlName="companyCode" required />
          <label for="companyCode">회사코드</label>
        </p-floatlabel>

        @if (fg.controls.companyCode.dirty && fg.controls.companyCode.errors?.['required']) {
          <p-message severity="error" size="small" variant="simple">Username is required.</p-message>
        }
      </div>

      <div class="flex flex-col gap-1">
        <p-floatlabel>
          <input id="companyName" pInputText formControlName="companyName" required />
          <label for="companyName">회사명</label>
        </p-floatlabel>

        @if (fg.controls.companyName.dirty && fg.controls.companyName.errors?.['required']) {
          <p-message severity="error" size="small" variant="simple">Username is required.</p-message>
        }
      </div>


      <!--
      <div nz-row nzGutter="8">

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="companyCode" label="회사코드" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="companyCode" formControlName="companyCode" required
                placeholder="회사코드를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="companyName" label="회사명" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="companyName" formControlName="companyName" required
                placeholder="회사명을 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

      </div>


      <div nz-row nzGutter="8">
        <div nz-col nzSpan="8">
          <nz-form-item-custom for="businessRegistrationNumber" label="사업자등록번호" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="businessRegistrationNumber" formControlName="businessRegistrationNumber" required
                placeholder="사업자등록번호를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="coporationNumber" label="법인번호" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="coporationNumber" formControlName="coporationNumber" required
                placeholder="법인번호를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="nameOfRepresentative" label="대표자" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <input nz-input id="nameOfRepresentative" formControlName="nameOfRepresentative" required
                placeholder="대표자를 입력해주세요."/>
            </nz-form-control>
          </nz-form-item-custom>
        </div>

        <div nz-col nzSpan="8">
          <nz-form-item-custom for="establishmentDate" label="시작일" required>
            <nz-form-control nzHasFeedback [nzErrorTip]="errorTpl">
              <nz-date-picker nzId="establishmentDate" formControlName="establishmentDate">
              </nz-date-picker>
            </nz-form-control>
          </nz-form-item-custom>
        </div>
      </div>
      -->

    </form>
    </div>
  `,
  styles: `
  `
})
export class CompanyFormComponent  {

  private notifyService = inject(NotifyService);
  private renderer = inject(Renderer2);
  private http = inject(HttpClient);

  formSaved = output<any>();
  formDeleted = output<any>();
  formClosed = output<any>();

  fg = inject(FormBuilder).group({
    companyCode                 : new FormControl<string | null>(null, { validators: [Validators.required] }),
    companyName                 : new FormControl<string | null>(null, { validators: [Validators.required] }),
    businessRegistrationNumber  : new FormControl<string | null>(null),
    coporationNumber            : new FormControl<string | null>(null),
    nameOfRepresentative        : new FormControl<string | null>(null),
    establishmentDate           : new FormControl<Date | null>(null)
  });

  formDataId = input<string>('');

  constructor() {

    effect(() => {
      if (this.formDataId()) {
        this.get(this.formDataId());
      }
    })
  }

  focusInput() {
    this.renderer.selectRootElement('#companyCode').focus();
  }

  newForm() {
    this.fg.reset();
    this.focusInput();
  }

  modifyForm(formData: Company) {
    this.fg.patchValue(formData);
  }

  closeForm() {
    this.formClosed.emit(this.fg.getRawValue());
  }

  get(id: string) {
    const url = GlobalProperty.serverUrl() + `/api/system/company/${id}`;
    const options = getHttpOptions();

    this.http.get<ResponseObject<Company>>(url, options).pipe(
        //  catchError(this.handleError<ResponseObject<Company>>('get', undefined))
        )
        .subscribe(
          (model: ResponseObject<Company>) => {
            model.data ? this.modifyForm(model.data) : this.newForm()
          }
        )

  }

  save() {
    if (this.fg.invalid) {
      Object.values(this.fg.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const url = GlobalProperty.serverUrl() + `/api/system/company`;
    const options = getHttpOptions();

    this.http.post<ResponseObject<Company>>(url, this.fg.getRawValue(), options).pipe(
         // catchError(this.handleError<ResponseObject<Company>>('save', undefined))
        )
        .subscribe(
          (model: ResponseObject<Company>) => {
            this.notifyService.changeMessage(model.message);
            this.formSaved.emit(this.fg.getRawValue());
          }
        )
  }

  remove() {
    const url = GlobalProperty.serverUrl() + `/api/system/company/${this.fg.controls.companyCode.value!}`;
    const options = getHttpOptions();

    this.http.delete<ResponseObject<Company>>(url, options).pipe(
       //   catchError(this.handleError<ResponseObject<Company>>('delete', undefined))
        )
        .subscribe(
          (model: ResponseObject<Company>) => {
          this.notifyService.changeMessage(model.message);
          this.formDeleted.emit(this.fg.getRawValue());
          }
      )
  }

}
