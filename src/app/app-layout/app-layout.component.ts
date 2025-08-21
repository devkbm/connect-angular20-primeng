import { Component, OnInit, TemplateRef, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';``
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { UserSessionService } from 'src/app/core/service/user-session.service';
import { NotifyService } from 'src/app/core/service/notify.service';

import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';
import { ResponseList } from 'src/app/core/model/response-list';
import { catchError, combineLatest, of, switchMap } from 'rxjs';
import { ALayout } from "./a-layout";



import { UserProfileComponent } from "./user-profile/user-profile.component";

import { SessionManager } from '../core/session-manager';
import { MenuHierarchy } from './app-layout.model';

import { SelectModule } from 'primeng/select';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-layout',
  imports: [
    RouterModule,
    FormsModule,
    ALayout,
    UserProfileComponent,

    SelectModule,
    AvatarModule,
    ButtonModule,
    PopoverModule,
    CardModule
],
  template: `
<a-layout>

<!--
  <nz-sider
    class="sidebar"
    nzCollapsible
    [(nzCollapsed)]="sideMenu.isCollapsed"
    [nzCollapsedWidth]="0"
    [nzWidth]="200"
    [nzTrigger]="triggerTemplate">
      <app-side-menu
        [menuGroupCode]="sideMenu.menuGroupCode">
      </app-side-menu>
  </nz-sider>
-->
  <a-layout>




    <div class="header">


      <p-select [(ngModel)]="menuGroupInfo.selectedId" (ngModelChange)="moveToMenuGroupUrl($event)"
        [options]="menuGroupInfo.list" optionLabel="menuGroupName" optionValue="menuGroupCode"
        placeholder="Select a City" class="w-full md:w-56"
      />

      <button (click)="test()">test</button>

      <div class="absolute inset-y-0 right-0">
        <p-avatar [image]="profileAvatarSrc" class="mr-2" size="large" (click)="op.toggle($event)" />
        <p-popover #op>
          <app-user-profile></app-user-profile>
        </p-popover>  
      </div>
      

      <!--
      <brn-popover class="avatar">
        <button brnPopoverTrigger >
            <hlm-avatar variant="large">
              <img [src]="profileAvatarSrc" hlmAvatarImage />
              <span class="bg-[#FD005B] text-white" hlmAvatarFallback>RG</span>
            </hlm-avatar>
        </button>

        <div hlmPopoverContent *brnPopoverContent="let ctx">
          <app-user-profile></app-user-profile>
        </div>
      </brn-popover>
      -->



      <!--
      <nz-avatar class="avatar" nzShape="square" [nzSize]='48' [nzSrc]="profileAvatarSrc" nz-dropdown [nzDropdownMenu]="menu" nzTrigger="click">
        <nz-dropdown-menu #menu="nzDropdownMenu">
          프로필 정보
          <app-user-profile></app-user-profile>
        </nz-dropdown-menu>
      </nz-avatar>
        -->
    </div>


    <ng-content class="main-content">
      <router-outlet></router-outlet>
    </ng-content>

    <!--
    <div class="footer">
      {{footerMessage}}
    </div>
    -->
  </a-layout>
</a-layout>
  `,
  styles: `


.sidebar {
  background: black;
  height: calc(100vh - 64px);
  /* text 드래그 막기 */
  -webkit-touch-callout: none;  /* iOS Safari */
  -webkit-user-select: none;    /* Safari */
  -khtml-user-select: none;     /* Konqueror HTML */
  -moz-user-select: none;       /* Old versions of Firefox */
  -ms-user-select: none;        /* Internet Explorer/Edge */
  user-select: none;            /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}

.header {
  height: var(--app-header-height);
  padding: 0;
  margin: 0;
  //align-content: center;
  //vertical-align: text-top;
}

.collapse-icon {
  margin-top: 20px;
  margin-left: 5px;
  font-size: 24px;
  color:rgb(185, 173, 159);
  vertical-align: top;
}

.menu-group {
  width: 150px;
  //padding-top: 12px;
  margin-right: 10px;
  margin-left: 10px;
  //vertical-align: top;
}

.avatar {
  float: right;
  margin-top: 8px;
  margin-right: 20px;
  vertical-align: top;
}

.main-content {
  margin-top: var(--app-content-margin-height);
  margin-right: 12px;
  margin-bottom: 0px;
  margin-left: 12px;
  background-color: black;
  /* 헤더, 본문 margin, 푸터를 제외한 높이로 설정 */
  height: calc(100vh - (var(--app-header-height) + var(--app-content-margin-height) + var(--app-footer-height)));
  width: auto;
  /*overflow-y: hidden;*/
}

.footer {
  position: sticky;
  margin: 0px;
  height: var(--app-footer-height);
  text-align: center;
  vertical-align: middle;
  background-color: black;
}
  `
})
export class AppLayoutComponent implements OnInit  {

  profileAvatarSrc: string | undefined;

  menuGroupInfo: {list: {menuGroupCode: string, menuGroupName: string, menuGroupUrl: string}[], selectedId: string} = {
    list: [],
    selectedId: ''
  }

  // 기본 SIDER 메뉴 트리거 숨기기위해 사용
  triggerTemplate: TemplateRef<void> | null = null;

  footerMessage: string = '';

  sideMenu : {menuGroupCode: string, isCollapsed: boolean} = {menuGroupCode: '', isCollapsed: false};

  isForwarding = input<boolean>(false);

  private notifyService = inject(NotifyService);
  private sessionService = inject(UserSessionService);
  private router = inject(Router);
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.setAvatar();

    this.notifyService.currentMessage.subscribe(message => this.footerMessage = message);

    this.setInitMenuGroup();

    /*
    console.log(this.menuGroupInfo.list);
    console.log(this.isForwarding());
    console.log(this.router.url);
    console.log(this.router.url.split(';')[0].split('/')[1]);
    console.log(this.getMenuGroupCode(this.router.url.split(';')[0].split('/')[1]));
    */

    if (this.isForwarding()) {
      const sessionMenuGroup  = sessionStorage.getItem('selectedMenuGroup');

      if (sessionMenuGroup !== 'null' && sessionMenuGroup) {
        this.menuGroupInfo.selectedId = sessionMenuGroup;
        this.sideMenu.menuGroupCode = sessionMenuGroup;
      } else {
        this.menuGroupInfo.selectedId = this.menuGroupInfo.list[0].menuGroupCode;
        this.sideMenu.menuGroupCode = this.menuGroupInfo.list[0].menuGroupCode;
      }

      const lastVisitUrl    = sessionStorage.getItem('lastVisitUrl');
      if (lastVisitUrl !== 'null' && lastVisitUrl) {
        this.router.navigate([lastVisitUrl]);
      } else {
        this.moveToMenuGroupUrl(this.menuGroupInfo.selectedId);
      }

    } else {
      const menuGroupUrl = this.router.url.split(';')[0].split('/')[1];
      const menuGroupCode = this.getMenuGroupCode(menuGroupUrl);

      this.menuGroupInfo.selectedId = menuGroupCode;
      this.sideMenu.menuGroupCode = menuGroupCode;
    }

  }

  setAvatar(): void {
    const profilePictureUrl: string | null = this.sessionService.getAvartarImageString();
    if (profilePictureUrl) {
      this.profileAvatarSrc = profilePictureUrl as string;
    }
  }

  /**
   * 상단 메뉴그룹 콤보박스 데이터를 설정한다.
   */
  setInitMenuGroup() {
    const stringMenuGroupList = sessionStorage.getItem('menuGroupList') as string;
    this.menuGroupInfo.list   = JSON.parse(stringMenuGroupList);
  }

  getMenuGroupCode(url: string) {
    for (const menuGroup of this.menuGroupInfo.list) {
      if (menuGroup.menuGroupUrl === url) {
        return menuGroup.menuGroupCode;
      }
    }
    return '';
  }

  moveToMenuGroupUrl(menuGroupCode: string) {
    this.menuGroupInfo.selectedId = menuGroupCode;
    this.sideMenu.menuGroupCode = menuGroupCode;
    sessionStorage.setItem('selectedMenuGroup', menuGroupCode);

    this.getMenuList(menuGroupCode);

    this.router.navigate([this.getMenuGroupUrl(menuGroupCode)]);
  }

  getMenuGroupUrl(menuGroupCode: string) {
    for (const menuGroup of this.menuGroupInfo.list) {
      if (menuGroup.menuGroupCode === menuGroupCode) {
        return menuGroup.menuGroupUrl;
      }
    }
    return '';
  }

  moveToUrl(url: string) {
    this.router.navigate([url]);
  }

  getMenuList(menuGroupCode: string): void {

    const userId = SessionManager.getUserId() as string;
    const url =  GlobalProperty.serverUrl() + `/api/system/menuhierarchy/${userId}/${menuGroupCode}`;
    const options = getHttpOptions();

    this.http.get<ResponseList<MenuHierarchy>>(url, options).pipe(
          // catchError(this.handleError<ResponseObject<BizCode>>('get', undefined))
        )
        .subscribe(
          (model: ResponseList<MenuHierarchy>) => {
            //this.menuInfo.menuItems = model.data;
            sessionStorage.setItem('menuList', JSON.stringify(model.data));
          }
        );
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

  logout2() {
    /*
    const url = GlobalProperty.serverUrl() + `/api/system/user/logout`;
    const options = getHttpOptions();

    this.http.get<ResponseList<any>>(url, options).pipe(
      //catchError((err) => Observable.throw(err))
    ).subscribe(
      (model: ResponseList<any>) => {
        console.log(model);
        this.router.navigate(['/login']);
      }
    );
    */

    const url1 = GlobalProperty.serverUrl() + `/api/system/user/auth1`;
    const url2 = GlobalProperty.serverUrl() + `/api/system/user/logout`;
    const options = getHttpOptions();

    const auth = this.http.get<ResponseList<any>>(url1, options).pipe(

    );
    const out = this.http.get<ResponseList<any>>(url2, options).pipe(
      //catchError((err) => Observable.throw(err))
    );

    combineLatest([auth, out]).subscribe(
      (model: ResponseList<any>[]) => {
        console.log(model);
        //this.router.navigate(['/login']);
      }
    );
  }


  test(): void {
    const url = GlobalProperty.serverUrl() + `/api/system/user/auth1`;
    const options = getHttpOptions();

    this.http.get<ResponseList<any>>(url, options).pipe(
      //catchError((err) => Observable.throw(err))
    ).subscribe(
      (model: ResponseList<any>) => {
        console.log(model);
      }
    );
  }

}
