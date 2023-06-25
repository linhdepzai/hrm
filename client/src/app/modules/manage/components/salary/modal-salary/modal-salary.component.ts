import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { Position } from 'src/app/interfaces/interfaceReponse';
import { Level } from 'src/app/enums/Enum';
import { DataService } from 'src/app/services/data.service';
import { SalaryService } from 'src/app/services/salary.service';
import { PositionService } from 'src/app/services/position.service';

@Component({
  selector: 'app-modal-salary',
  templateUrl: './modal-salary.component.html',
  styleUrls: ['./modal-salary.component.css']
})
export class ModalSalaryComponent implements OnInit {
  @Input() isVisibleModal: boolean = false;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  salaryForm!: FormGroup;
  levelList = new Observable<{ value: Level; label: string }[]>();
  positionList = new Observable<Position[]>();

  constructor(
    private salaryService: SalaryService,
    private dataService: DataService,
    private positionService: PositionService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.positionService.getAllPosition();
    this.levelList = this.dataService.levelList;
    this.positionList = this.positionService.positionList$;
    this.salaryForm = this.fb.group({
      actionId: [null, Validators.required],
      level: [null, Validators.required],
      position: [null, Validators.required],
      money: [null, Validators.required],
      welfare: [null, Validators.required],
    });
  }

  submitForm() {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.salaryForm.controls['actionId'].setValue(user.id);
    if (this.salaryForm.valid) {
      this.salaryService
        .createSalary(this.salaryForm.value)
        .subscribe((response) => {
          if (response.statusCode == 200) {
            this.notification.success('Successfully!!!', '');
            this.cancel.emit();
          }
        });
    } else {
      Object.values(this.salaryForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleCancel() {
    this.cancel.emit();
  }
}
