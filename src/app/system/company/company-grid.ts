import { Component, OnInit, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { ResponseList } from 'src/app/core/model/response-list';
import { GlobalProperty } from 'src/app/core/global-property';
import { getHttpOptions } from 'src/app/core/http/http-utils';

import { TableModule } from 'primeng/table';

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
  selector: 'app-company-grid',
  imports: [
    CommonModule,    
    FormsModule,
    TableModule
  ],
  template: `
    
    <p-table [value]="gridResource.value()?.data!" selectionMode="single" [(selection)]="selectedRow" [tableStyle]="{ 'min-width': '50rem' }">
        <ng-template #header>
            <tr>
                <th>회사코드</th>
                <th>회사명</th>
                <th>사업자등록번호</th>
                <th>법인번호</th>
                <th>대표자</th>
                <th>설립일</th>
            </tr>
        </ng-template>
        <ng-template #body let-data>
            <tr [pSelectableRow]="data">
                <td>{{ data.companyCode }}</td>
                <td>{{ data.companyName }}</td>
                <td>{{ data.businessRegistrationNumber }}</td>
                <td>{{ data.coporationNumber }}</td>
                <td>{{ data.nameOfRepresentative }}</td>
                <td>{{ data.establishmentDate }}</td>
            </tr>
        </ng-template>
    </p-table>
  `,
  styles: []
})
export class CompanyGridComponent {

  private http = inject(HttpClient);

  rowClicked = output<Company>();
  rowDoubleClicked = output<Company>();
  editButtonClicked = output<Company>();

  _data: Company[] = [];

  selectedRow?: Company;

  constructor() {
    this.gridResource.reload();
  }
  
  /*
  columnDefs: ColDef[] = [
    {
      headerName: '',
      width: 40,
      cellStyle: {'text-align': 'center', 'padding': '0px', 'margin': '0px'},
      cellRenderer: ButtonRendererComponent,
      cellRendererParams: {
        onClick: this.onEditButtonClick.bind(this),
        label: '',
        iconType: 'form'
      }
    },
    {
      headerName: 'No',
      valueGetter: 'node.rowIndex + 1',
      width: 70,
      cellStyle: {'text-align': 'center'}
    },
    { headerName: '회사코드',       field: 'companyCode',                 width: 80 },
    { headerName: '회사명',         field: 'companyName',                 width: 100 },
    { headerName: '사업자등록번호',  field: 'businessRegistrationNumber',  width: 120 },
    { headerName: '법인번호',       field: 'coporationNumber',            width: 100 },
    { headerName: '대표자',         field: 'nameOfRepresentative',        width: 100 },
    { headerName: '설립일',         field: 'establishmentDate',           width: 100 }
  ];
  */

  /*
  getRowId: GetRowIdFunc<Company> = (params: GetRowIdParams<Company>) => {
    return params.data.companyCode!;
  };
  */

  gridQuery = signal<any>('');
  gridResource = rxResource({
    params: () => this.gridQuery(),
    stream: ({params}) => this.http.get<ResponseList<Company>>(
      GlobalProperty.serverUrl() + `/api/system/company`,
      getHttpOptions(params)
    )
  })

  /*
  rowClickedFunc(event: RowClickedEvent<Company>) {
    this.rowClicked.emit(event.data!);
  }

  rowDoubleClickedFunc(event: RowDoubleClickedEvent<Company>) {
    this.rowDoubleClicked.emit(event.data!);
  }

  onEditButtonClick(e: {event: PointerEvent, rowData: any}) {
    this.editButtonClicked.emit(e.rowData);
  }
    */

}
