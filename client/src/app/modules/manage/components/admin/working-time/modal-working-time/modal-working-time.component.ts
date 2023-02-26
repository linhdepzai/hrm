import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ManageService } from 'src/app/modules/manage/services/manage.service';

@Component({
  selector: 'app-modal-working-time',
  templateUrl: './modal-working-time.component.html',
  styleUrls: ['./modal-working-time.component.css']
})
export class ModalWorkingTimeComponent implements OnInit {
  @Input() isVisibleModal: boolean = false;
  @Input() data: any;
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  workingTimeForm!: FormGroup;

  constructor(
    private manageService: ManageService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {

  }

  handleCancel() {
    this.cancel.emit();
  }

  submitForm() {

  }

  calcTime(startTime: any, endTime: any) {
    const total = endTime.substring(0, 2) - startTime.substring(0, 2);
    const totalMinute = (endTime.substring(3, 5) - startTime.substring(3, 5)) / 60;
    return total + totalMinute;
  }
}
