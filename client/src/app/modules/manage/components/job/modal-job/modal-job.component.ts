import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { Level } from 'src/app/enums/Enum';
import { Job, Position } from 'src/app/interfaces/interfaceReponse';
import { DataService } from 'src/app/services/data.service';
import { JobService } from 'src/app/services/job.service';
import { PositionService } from 'src/app/services/position.service';

@Component({
  selector: 'app-modal-job',
  templateUrl: './modal-job.component.html',
  styleUrls: ['./modal-job.component.css'],
})
export class ModalJobComponent {
  @Input() visible: boolean = false;
  @Input() data: Job | undefined;
  @Input() mode: string = 'create';
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  title: string = 'View';
  isEdit: boolean = false;
  jobForm!: FormGroup;
  positionList = new Observable<Position[]>();
  levelList = new Observable<{ value: Level; label: string }[]>();

  constructor(
    private jobService: JobService,
    private positionService: PositionService,
    private dataService: DataService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    private modal: NzModalService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.levelList = this.dataService.levelList;
    this.positionList = this.positionService.positionList$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.jobForm.reset();
    this.isEdit = true;
    if (this.mode == 'create') {
      this.title = 'Create';
      if (this.positionService.positionList$.value.length > 0) {
        this.jobForm.controls['positionId'].setValue(this.positionService.positionList$.value[0].id);
      }
      this.jobForm.controls['level'].setValue(this.dataService.levelList.value[0].value);
      this.jobForm.controls['quantity'].setValue(1);
      this.jobForm.controls['optionSalary'].setValue('Agreement');
      this.jobForm.controls['fromSalary'].setValue(10000000);
      this.jobForm.controls['toSalary'].setValue(20000000);
      this.jobForm.controls['visible'].setValue(false);
      this.jobForm.enable();
    } else {
      this.jobForm.patchValue(this.data!);
      if (this.jobForm.value.salaryRange.includes('About')) {
        this.jobForm.controls['optionSalary'].setValue('About');
        this.jobForm.controls['fromSalary'].setValue(this.jobForm.value.salaryRange.replace(/[^0-9]/g, ''));
      } else if (this.jobForm.value.salaryRange.includes('agreement')) {
        this.jobForm.controls['optionSalary'].setValue('Agreement');
      } else {
        this.jobForm.controls['optionSalary'].setValue('Range');
        this.jobForm.controls['fromSalary'].setValue(this.extractNumericalValues(this.jobForm.value.salaryRange)[0]);
        this.jobForm.controls['toSalary'].setValue(this.extractNumericalValues(this.jobForm.value.salaryRange)[1]);
      }
      this.jobForm.controls['dateRange'].setValue([this.jobForm.value.fromDate,this.jobForm.value.toDate]);
      this.changeMode();
    }
    this.setJobTitle();
  }

  initForm() {
    this.jobForm = this.fb.group({
      id: [null],
      jobTitle: [null, Validators.required],
      positionId: [null, Validators.required],
      level: [null, Validators.required],
      quantity: [1, Validators.required],
      salaryRange: [null, Validators.required],
      optionSalary: [null],
      fromSalary: [null],
      toSalary: [null],
      dateRange: [null, Validators.required],
      fromDate: [null],
      toDate: [null],
      description: [null, Validators.required],
      require: [null, Validators.required],
      visible: [null, Validators.required],
    });
  }

  changeMode() {
    this.isEdit = !this.isEdit;
    this.title = (this.isEdit ? 'Edit: ' : 'View: ') + this.data?.jobTitle;
    if (this.isEdit) {
      this.jobForm.enable();
    } else {
      this.jobForm.disable();
    }
  }

  setJobTitle() {
    const level = this.dataService.levelList.value.find(i => i.value == this.jobForm.value.level)?.label;
    const position = this.positionService.positionList$.value.find(i => i.id == this.jobForm.value.positionId)?.name;
    this.jobForm.controls['jobTitle'].setValue(level + ' ' + position);
  }

  extractNumericalValues(substring: string) {
    const matches = substring.match(/\d+\,\d+/g)!;
    let values = matches.map(match => parseFloat(match.replace(',', '')));
    values = [values[0]*1000, values[1]*1000];
    return values;
  }

  formatSalary(salary: number) {
    return salary.toLocaleString('en-US', { minimumFractionDigits: 0 }) + ' VND';
  }

  submitForm() {
    if(this.jobForm.value.optionSalary == 'Agreement') {
      this.jobForm.controls['salaryRange'].setValue('A wage agreement');
    } else if (this.jobForm.value.optionSalary == 'About') {
      this.jobForm.controls['salaryRange'].setValue('About ' + this.formatSalary(this.jobForm.value.fromSalary));
    } else {
      this.jobForm.controls['salaryRange'].setValue(this.formatSalary(this.jobForm.value.fromSalary) + ' ~ ' + this.formatSalary(this.jobForm.value.toSalary));
    }
    if (this.jobForm.valid) {
      this.jobForm.controls['fromDate'].setValue(this.jobForm.value.dateRange[0]);
      this.jobForm.controls['toDate'].setValue(this.jobForm.value.dateRange[1]);
      this.jobService.save(this.jobForm.value).subscribe((response) => {
        if (response.statusCode == 200) {
          this.notification.success('Successfully!', '');
          if (this.mode == 'Create') {
            this.jobService.jobList$.next([response.data,...this.jobService.jobList$.value]);
          } else {
            this.jobService.jobList$.value.splice(
              this.jobService.jobList$.value.findIndex(
                (item) => item.id === response.data.id
              ),
              1,
              response.data
            );
            this.jobService.jobList$.next([...this.jobService.jobList$.value]);
          }
          this.cancel.emit();
        }
      });
    } else {
      Object.values(this.jobForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  close() {
    this.cancel.emit();
  }

  confirmChange() {
    if (this.data!.visible) {
      this.modal.confirm({
        nzTitle: 'This job is currently being published. Are you sure you want to fix it?',
        //nzOnOk: OnClickCallback<unknown>,
      });
    }
    
  }
}
