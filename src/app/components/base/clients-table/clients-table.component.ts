  import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
  import {Users} from "../../../core/interfaces/users";
  import {MatTableDataSource} from "@angular/material/table";
  import {SelectionModel} from "@angular/cdk/collections";
  import {MatSort} from "@angular/material/sort";
  import {GetUsersService} from "../../../core/services/get-users.service";
  import { Observable } from "rxjs";
  import { MatDialog } from "@angular/material/dialog";
  import { MatSnackBar } from "@angular/material/snack-bar";
  import { AddEditUserDialogComponent } from "../../modals/add-edit-user-dialog/add-edit-user-dialog.component";
  import { DeleteUserDialogComponent } from "../../modals/delete-user-dialog/delete-user-dialog.component";

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
      private getUsersService: GetUsersService,
      private dialog: MatDialog,
      private snackBar: MatSnackBar
    ) {
    }

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

    // Modal dialog for adding new user
    openAddUserDialog(): void {
      const dialogRef = this.dialog.open(AddEditUserDialogComponent, {
        width: '448px',
        data: {user: null}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getUsersService.addUser(result).then(() => {
            this.refreshTableData();
          });
        }
      });
    }

    // Method to open the Edit User dialog
    openEditUserDialog(user: Users): void {
      const dialogRef = this.dialog.open(AddEditUserDialogComponent, {
        width: '448px',
        data: { user }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getUsersService.addUser(result).then(() => {
            this.refreshTableData();
          });
        }
      });
    }

    // Open conformation dialog to delete users
    openDeleteConfirmationDialog(): void {
      const selectedRowsCount = this.selection.selected.length;
      const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
        width: '400px',
        data: { count: selectedRowsCount }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteSelectedUsers();
        }
      });
    }

    // Method to delete selected users
    deleteSelectedUsers(): void {
      const selectedUsers = this.selection.selected;
      selectedUsers.forEach(user => {
        this.getUsersService.deleteUser(user.email).then(() => {
          this.refreshTableData();
        });
      });

      this.selection.clear();
    }


    // Refresh data in table
    refreshTableData(): void {
      this.getUsersService.getAllUsersObservable().subscribe((data) => {
        this.dataSource.data = data;
      });
    }
  }
