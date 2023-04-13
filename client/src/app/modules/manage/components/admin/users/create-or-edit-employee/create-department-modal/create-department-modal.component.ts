import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from 'src/app/modules/manage/services/department.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-create-department-modal',
  templateUrl: './create-department-modal.component.html',
  styleUrls: ['./create-department-modal.component.css']
})
export class CreateDepartmentModalComponent implements OnInit {
  @Input() isVisibleModal: boolean = false;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  departmentForm!: FormGroup;
  iconList: string[] = [];

  constructor(
    private departmentService: DepartmentService,
    private dataService: DataService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.dataService.iconList.subscribe((data) => { this.iconList = data });
  }

  initForm() {
    this.departmentForm = this.fb.group({
      id: [null],
      name: [null, Validators.required],
      color: ['#00ff00'],
      icon: ['house']
    });
  }

  submitForm() {
    if (this.departmentForm.valid) {
      this.departmentService.saveDepartment(this.departmentForm.value);
      this.handleCancel();
    } else {
      Object.values(this.departmentForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  randomColor() {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    this.departmentForm.controls['color'].setValue(randomColor);
  }

  randomIcon() {
    const randomIcon = Math.floor(Math.random() * 179);
    this.departmentForm.controls['icon'].setValue(this.iconList[randomIcon]);
  }

  handleCancel(): void {
    this.resetForm();
    this.cancel.emit();
  }

  resetForm() {
    this.departmentForm.reset();
    this.departmentForm.controls['color'].setValue('#00ff00');
    this.departmentForm.controls['icon'].setValue('house');
  }
}
