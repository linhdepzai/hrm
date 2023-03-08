import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { OptionOnLeave } from 'src/app/enums/Enum';
import { ManageService } from '../../../services/manage.service';

@Component({
  selector: 'app-modal-request-off',
  templateUrl: './modal-request-off.component.html',
  styleUrls: ['./modal-request-off.component.css']
})
export class ModalRequestOffComponent implements OnInit, OnChanges {
  @Input() isVisibleModal: boolean = false;
  @Input() requestList: any[] = [];
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  requestOnLeaveForm!: FormGroup;

  constructor(
    private manageService: ManageService,
    private fb: FormBuilder,
  ){}

  ngOnInit(): void {
    this.requestOnLeaveForm = this.fb.group({
      employeeId: [null],
      onLeave: this.fb.array([]),
    })
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.requestList.sort((a,b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    })
  }

  handleCancel(){
    this.cancel.emit();
  }

  getNameOptionLeave(option: OptionOnLeave){
    let name: any;
    this.manageService.requestOffList
      .subscribe((data: any[]) => {
        name = data.find(d => d.value == option)?.label;
      });
    return name;
  }

  handleSubmit(){
    this.requestList.forEach((member) => {
      const memberForm = this.fb.group({
        dateLeave: member.date,
        option: member.option,
        reason: 'fhgyfy',
      });
      (this.requestOnLeaveForm.controls['onLeave'] as FormArray).push(memberForm);
    });
    this.requestOnLeaveForm.controls['employeeId'].setValue('685369a4-75fa-4488-5927-08db142065da');
    this.manageService.requestOnLeave(this.requestOnLeaveForm.value);
  }
}
