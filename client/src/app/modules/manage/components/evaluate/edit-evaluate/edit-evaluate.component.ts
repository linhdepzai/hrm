import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { Level } from 'src/app/enums/Enum';
import { Evaluate } from 'src/app/interfaces/interfaceReponse';
import { DataService } from 'src/app/services/data.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { EvaluateService } from 'src/app/services/evaluate.service';

@Component({
  selector: 'app-edit-evaluate',
  templateUrl: './edit-evaluate.component.html',
  styleUrls: ['./edit-evaluate.component.css']
})
export class EditEvaluateComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() data!: Evaluate;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  title: string = 'View';
  isEdit: boolean = false;
  evaluateForm!: FormGroup;
  levelList = new Observable<{ value: Level; label: string }[]>();

  constructor(
    private employeeService: EmployeeService,
    private evaluateService: EvaluateService,
    private notification: NzNotificationService,
    private dataService: DataService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.levelList = this.dataService.levelList;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data) {
      this.isEdit = true;
      this.evaluateForm.reset();
      this.evaluateForm.patchValue(this.data);
      this.evaluateForm.controls['employeeId'].setValue(this.getUserName(this.data.employeeId));
      this.changeMode();
    }
  }

  initForm() {
    this.evaluateForm = this.fb.group({
      id: [null],
      employeeId: [null],
      dateEvaluate: [null],
      oldLevel: [null],
      newLevel: [true, Validators.required],
      note: [null, Validators.required],
    });
  }

  getUserName(id: string) {
    return this.employeeService.employeeList$.value.find(d => d.id == id)?.fullName;
  }

  changeMode() {
    this.isEdit = !this.isEdit;
    this.title = (this.isEdit ? 'Evaluate: ' : 'View: ') + this.getUserName(this.data.employeeId);
    if (this.isEdit) {
      this.evaluateForm.enable();
      this.evaluateForm.controls['employeeId'].disable();
      this.evaluateForm.controls['dateEvaluate'].disable();
      this.evaluateForm.controls['oldLevel'].disable();
    } else {
      this.evaluateForm.disable();
    }
  }

  submitForm() {
    this.evaluateService.updateEvaluate(this.evaluateForm.value)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.notification.success('Successfully!', '');
          this.evaluateService.evaluateList$.value.splice(
            this.evaluateService.evaluateList$.value.findIndex((item) => item.id === response.data.id),
            1, response.data);
          this.evaluateService.evaluateList$.next([...this.evaluateService.evaluateList$.value]);
          this.cancel.emit();
        };
      });
  }

  close() {
    this.cancel.emit();
  }
}
