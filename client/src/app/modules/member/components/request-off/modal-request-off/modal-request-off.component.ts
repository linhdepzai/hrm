import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { OptionRequestOff, Status } from 'src/app/enums/Enum';
import { DataService } from 'src/app/services/data.service';
import { RequestOffService } from 'src/app/services/requestoff.service';

@Component({
  selector: 'app-modal-request-off',
  templateUrl: './modal-request-off.component.html',
  styleUrls: ['./modal-request-off.component.css']
})
export class ModalRequestOffComponent implements OnInit, OnChanges {
  @Input() isVisibleModal: boolean = false;
  @Input() requestList: { dayOff: Date, option: OptionRequestOff, status: Status }[] = [];
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  @Output() submit: EventEmitter<boolean> = new EventEmitter();
  requestOffForm!: FormArray;

  constructor(
    private requestOffService: RequestOffService,
    private dataService: DataService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.requestOffForm = this.fb.array([]);
  }

  ngOnChanges(): void {
    this.requestList.sort((a, b) => {
      return new Date(a.dayOff).getTime() - new Date(b.dayOff).getTime();
    })
  }

  handleCancel() {
    this.cancel.emit();
  }

  getNameOptionLeave(option: OptionRequestOff) {
    return this.dataService.requestOffList.value.find(d => d.value == option)?.label;;
  }

  handleSubmit() {
    if ((<HTMLInputElement>document.getElementById('reason')).value == '') {
      this.notification.warning('You must input reason!!!', '');
    } else {
      this.requestList.forEach((item) => {
        const requestItemForm = this.fb.group({
          dayOff: new Date((item.dayOff as Date).setHours(7)),
          option: item.option,
          reason: (<HTMLInputElement>document.getElementById('reason')).value,
        });
        this.requestOffForm.push(requestItemForm);
      });
      this.requestOffService.requestOff(this.requestOffForm.value)
        .subscribe((response) => {
          this.requestOffService.getAllRequestOff();
          this.notification.success('Successfully!!!', `There are ${response.data.length} items have been added!`);
        });
      this.submit.emit();
    }
  }
}
