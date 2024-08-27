import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Users} from "../../../core/interfaces/users";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatSort, Sort} from "@angular/material/sort";

const USERS: Users[] = [
  {
    "name": "Александр",
    "surname": "Петров",
    "email": "petrov@mail.ru",
    "phone": "+79061856195"
  },
  {
    "name": "Павел",
    "surname": "Прилучный",
    "email": "ppl98@mail.ru",
    "phone": "+79891456090"
  },
  {
    "name": "Иван",
    "surname": "Охлобыстин",
    "email": "iohl_990@mail.ru",
    "phone": "+79053856195"
  },
  {
    "name": "Марина",
    "surname": "Александрова",
    "email": "malexan21@mail.ru",
    "phone": "+79052206950"
  },
  {
    "name": "Юрий",
    "surname": "Борисов",
    "email": "borisov@gmail.com",
    "phone": ""
  }
]

@Component({
  selector: 'app-clients-table',
  templateUrl: './clients-table.component.html',
  styleUrls: ['./clients-table.component.scss']
})


export class ClientsTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['select', 'name', 'surname', 'email', 'phone'];
  dataSource = new MatTableDataSource<Users>(USERS);
  selection = new SelectionModel<Users>(true, []);

  constructor(private _liveAnnouncer: LiveAnnouncer) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  // /** Announce the change in sort state for assistive technology. */
  // announceSortChange(sortState: Sort) {
  //   // This example uses English messages. If your application supports
  //   // multiple language, you would internationalize these strings.
  //   // Furthermore, you can customize the message to add additional
  //   // details about the values being sorted.
  //   if (sortState.direction) {
  //     this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
  //   } else {
  //     this._liveAnnouncer.announce('Sorting cleared');
  //   }
  // }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Users): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`; /*row ${row.position + 1}*/
  }
}
