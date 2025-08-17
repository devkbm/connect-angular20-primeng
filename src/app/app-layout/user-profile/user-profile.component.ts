import { Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { catchError, of, switchMap } from 'rxjs';

import { SystemUserProfile, UserSessionService } from 'src/app/core/service/user-session.service';
import { ResponseObject } from 'src/app/core/model/response-object';

/*
import { BrnSeparator } from '@spartan-ng/brain/separator';
import { HlmSeparator } from '@spartan-ng/helm/separator';

import { HlmIcon } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSettings, lucidePenLine, lucideLogOut } from '@ng-icons/lucide';


import {
  HlmCardContent,
  HlmCardDescription,
  HlmCard,
  HlmCardFooter,
  HlmCardHeader,
  HlmCardTitle,
  HlmCardAction,
} from '@spartan-ng/helm/card';
*/

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseList } from 'src/app/core/model/response-list';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-user-profile',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    NgOptimizedImage
],
  providers: [
  //  provideIcons({ lucideSettings, lucidePenLine, lucideLogOut })
  ],
  template: `
    <p-card>
      <ng-template #header>
        <img [src]="profilePictureSrc" style="width: 100px"/>
         asfsf
      </ng-template>

      <ng-template #footer>
        <div class="flex gap-4 mt-1">
            <p-button label="Cancel" severity="secondary" class="w-full" [outlined]="true" styleClass="w-full" />
            <p-button label="Save" class="w-full" styleClass="w-full" />
        </div>
    </ng-template>
    </p-card>
    <!--
    <section hlmCard>
      <div hlmCardHeader>
        <h3 hlmCardTitle>Card Title</h3>
        <p hlmCardDescription>Card Description</p>
            <div hlmCardAction></div>
      </div>
      <p hlmCardContent>Card Content</p>

       <brn-separator hlmSeparator class="my-4" />

      <div hlmCardFooter class="flex h-5 items-center space-x-4 text-sm" >
          <ng-icon hlm name="lucideSettings"/>
          <brn-separator decorative hlmSeparator orientation="vertical" />
          <ng-icon hlm name="lucidePenLine" (click)="test2()"/>
          <brn-separator decorative hlmSeparator orientation="vertical" />
          <ng-icon hlm name="lucideLogOut" (click)="logout()"/>
      </div>
    </section>
    -->

    <!--
    <div class="card">
      <nz-card [nzBordered]="false" [nzActions]="[actionSetting, actionEdit, actionEllipsis]">
        <nz-card-meta
          [nzAvatar]="avatarTemplate"
          [nzTitle]="titleTemplate"
          [nzDescription]="descTemplate">
        </nz-card-meta>
      </nz-card>

      <ng-template #avatarTemplate>
        <nz-avatar class="avatar" [nzShape]="'square'" [nzSize]='48' [nzSrc]="profilePictureSrc"></nz-avatar>
      </ng-template>

      <ng-template #titleTemplate>
        {{profile?.staffName + '(' + profile?.userId + ')'}} <br/>
        {{profile?.session?.lastAccessedTime | date:"yyyy/MM/dd HH:mm:ss"}}
      </ng-template>

      <ng-template #descTemplate>
        {{profile?.deptName}}
      </ng-template>

      <ng-template #actionSetting>
        <nz-icon nzType="setting" />
      </ng-template>
      <ng-template #actionEdit>
        <nz-icon nzType="edit" (click)="test2()" />
      </ng-template>
      <ng-template #actionEllipsis>


        <nz-icon nzType="logout"
          nz-popconfirm
          nzPopconfirmTitle="로그아웃 하시겠습니까?"
          (nzOnConfirm)="logout()"
          (nzOnCancel)="false"
          nzPopconfirmPlacement="bottomRight"
          />
      </ng-template>

    </div>
-->
  `,
  styles: [`
    .card {
      //width: 300px;
      //height: 147px;
      height: calc(100% - 22px);
      background-color: green;
      border: 1px solid rgb(232, 232, 232);
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }

    .card:hover {
      box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }
  `]
})
export class UserProfileComponent {

  profilePictureSrc: any;
  profile?: SystemUserProfile;

  private sessionService = inject(UserSessionService);
  private router = inject(Router);
  private http = inject(HttpClient);
  //private modal = inject(NzModalService);

  constructor() {
    this.profilePictureSrc = this.sessionService.getAvartarImageString();
    this.getMyInfo();
  }

  getMyInfo(): void {
    this.sessionService
        .getMyProfile()
        .subscribe(
            (model: ResponseObject<SystemUserProfile>) => {
              this.profile = model.data;
            }
        );
  }

  logoutConfirm() {
    /*
     this.modal.confirm({
      nzTitle: '로그 아웃하시겠습니까?',
      nzContent: '<b style="color: red;">Some descriptions</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.logout(),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
    */
  }

  logout() {
    const url1 = GlobalProperty.serverUrl() + `/api/system/user/auth1`;
    const url2 = GlobalProperty.serverUrl() + `/api/system/user/logout`;
    const options = getHttpOptions();

    this.http.get<any>(url1, options).pipe(
      switchMap(res => {
        //console.log(res.authenticated);
        if (res.authenticated) {
          return this.http.get<ResponseList<boolean>>(url2, options);
        } else {
          return of(false);
        }
      }),
      catchError((err) => { return of(false) })
    )
    .subscribe(logout => {
      this.router.navigate(['/login']);
    });
  }

  test2(): void {
    sessionStorage.setItem('selectedMenuGroup', 'ENV');
    sessionStorage.setItem('lastVisitUrl', '/profile/edit');

    this.router.navigate(['/profile/edit']);
  }

}

