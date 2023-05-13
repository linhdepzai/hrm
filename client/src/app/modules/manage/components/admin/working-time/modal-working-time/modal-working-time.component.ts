import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Status } from 'src/app/enums/Enum';
import { TimeWorkingResponse } from 'src/app/interfaces/interfaceReponse';
import { TimeworkingService } from 'src/app/services/timeworking.service';

@Component({
  selector: 'app-modal-working-time',
  templateUrl: './modal-working-time.component.html',
  styleUrls: ['./modal-working-time.component.css']
})
export class ModalWorkingTimeComponent implements OnInit {
  @Input() isVisibleModal: boolean = false;
  @Input() data!: TimeWorkingResponse;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  workingTimeForm!: FormGroup;

  constructor(
    private timeworkingService: TimeworkingService,
    private notification: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {

  }

  handleCancel() {
    this.cancel.emit();
  }

  submitForm(value: string) {
    this.timeworkingService.updateStatusChangeTimeWorking({ id: this.data.id, status: value == 'approve' ? Status.Approved : Status.Rejected })
      .subscribe((response) => {
        this.timeworkingService.timeWorkingList$.value.splice(this.timeworkingService.timeWorkingList$.value.findIndex((item) => item.id == response.data.id), 1, response.data);
        this.timeworkingService.timeWorkingList$.next([...this.timeworkingService.timeWorkingList$.value]);
        this.notification.success('Successfully', '');
        this.cancel.emit();
      });
  }

  calcTime(startTime: any, endTime: any) {
    const total = endTime.substring(0, 2) - startTime.substring(0, 2);
    const totalMinute = (endTime.substring(3, 5) - startTime.substring(3, 5)) / 60;
    return total + totalMinute;
  }
}
