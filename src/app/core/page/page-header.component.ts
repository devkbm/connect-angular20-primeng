import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

export interface MenuBreadCrumb {
  name: string;
  isLink: boolean;
  url?: string;
  marked?: boolean
}

@Component({
  selector: 'app-page-header',
  imports: [
    CommonModule,
    RouterModule,
    Breadcrumb,
  ],
  providers: [
  ],
  template: `

    <p-breadcrumb [model]="items" [home]="home" />
    <!--{{menuBreadCrumb|json}}-->

    <!--
    <nav hlmBreadcrumb>
      <ol hlmBreadcrumbList>
        <li hlmBreadcrumbItem>
          <ng-icon hlm size='sm' name="lucideHouse" />
        </li>
        <li hlmBreadcrumbSeparator></li>

        @for (menu of menuBreadCrumb; track menu.url; let idx = $index, cnt = $count) {
          <li hlmBreadcrumbItem>{{menu.name}}</li>
          @if (idx + 1 < cnt) {
            <li hlmBreadcrumbSeparator></li>
          }
        }
      </ol>
    </nav>
-->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {

  items: MenuItem[] | undefined;
  home: MenuItem | undefined = { icon: 'pi pi-home', routerLink: '/' };

  menuBreadCrumb: MenuBreadCrumb[] = this.createBreadCrumb();

  protected _location = inject(Location);

  goBack() {
    this._location.back();
  }

  goFoward() {
    this._location.forward();
  }

  constructor() {
    this.menuBreadCrumb.forEach((value) => {
      this.items?.push({label: value.name});
    })
  }

  createBreadCrumb(): MenuBreadCrumb[] {

    const menuGroupList = JSON.parse(sessionStorage.getItem('menuGroupList') as string);
    const sessionMenuGroup    = sessionStorage.getItem('selectedMenuGroup') as string;
    let menuGroupUrl = '';
    for (const menuGroup of menuGroupList) {
      if (menuGroup.menuGroupCode === sessionMenuGroup) {
        menuGroupUrl = menuGroup.menuGroupUrl;
      }
    }

    const obj = JSON.parse(sessionStorage.getItem('menuList') as string);
    if (obj === null) return [];

    let names: MenuBreadCrumb[] = new Array();
    // 현재 화면에 해당하는 메뉴 탐색
    let find = (children: any[]): boolean => {
      for (const child of children) {
        names.push({name: child.title, isLink: child.menuType === 'ITEM' ? true : false, url: child.url, marked: false});
        if (child.leaf) {
          if (window.location.pathname === '/' + menuGroupUrl + '/' + child.url) {
            names[names.length-1].marked = true;
            return true;
          } else {
            names.pop();  // Leaf 노드중 일치하지 않은 메뉴 제거
          }
        } else if (child.children) {
          find(child.children);
          if (names[names.length-1].marked !== true) { // Leaf 노드 중 marked 되지 않은 노드 제거
            names.pop();
          }
        }
      }
      return false;
    }
    find(obj);

    //console.log(names);
    return names;
  }

}
