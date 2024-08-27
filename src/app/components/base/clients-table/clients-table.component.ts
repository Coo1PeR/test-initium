  import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
  import {Users} from "../../../core/interfaces/users";
  import {MatTableDataSource} from "@angular/material/table";
  import {SelectionModel} from "@angular/cdk/collections";
  import {MatSort} from "@angular/material/sort";
  import {GetUsersService} from "../../../core/services/get-users.service";
  import {Observable} from "rxjs";

  @Component({
    selector: 'app-clients-table',
    templateUrl: './clients-table.component.html',
    styleUrls: ['./clients-table.component.scss']
  })

  export class ClientsTableComponent implements OnInit, AfterViewInit {
    dataSource: MatTableDataSource<Users> = new MatTableDataSource<Users>([]);
    users$: Observable<Users[]> | undefined;
    displayedColumns: string[] = ['select', 'name', 'surname', 'email', 'phone'];
    selection = new SelectionModel<Users>(true, []);

    constructor(
      private getUsersService: GetUsersService
    ) {}

    // Get users
    ngOnInit(): void {
      this.users$ = this.getUsersService.getAllUsersObservable();
      this.users$.subscribe((data) => {
        this.dataSource.data = data ?? [];
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      });
    }

    // Sorting
    @ViewChild(MatSort) sort!: MatSort;

    ngAfterViewInit() {
      this.dataSource.sort = this.sort;
    }

    // CheckBoxes
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }

    toggleAllRows() {
      if (this.isAllSelected()) {
        this.selection.clear();
        return;
      }

      this.selection.select(...this.dataSource.data);
    }

    checkboxLabel(row?: Users): string {
      if (!row) {
        return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
    }
  }
