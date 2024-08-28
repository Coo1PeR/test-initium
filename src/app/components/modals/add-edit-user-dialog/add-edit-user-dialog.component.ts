import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Users } from "../../../core/interfaces/users";

@Component({
  selector: 'app-add-edit-user-dialog',
  templateUrl: './add-edit-user-dialog.component.html',
  styleUrls: ['./add-edit-user-dialog.component.scss']
})
export class AddEditUserDialogComponent {
  userForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddEditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: Users | null },
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      id: [data.user ? data.user.id : null],
      name: [data.user ? data.user.name : '', [Validators.required, Validators.minLength(2)]],
      surname: [data.user ? data.user.surname : '', [Validators.required, Validators.minLength(2)]],
      email: [data.user ? data.user.email : '', [Validators.required, Validators.email]],
      phone: [data.user ? data.user.phone : '+7', [Validators.pattern('^\\+?7(\\d{10})$')]]
    });
  }

  onSave(): void {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
