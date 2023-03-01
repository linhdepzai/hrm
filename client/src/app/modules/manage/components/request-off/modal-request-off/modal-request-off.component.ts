import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { OptionOnLeave } from 'src/app/enums/Enum';
import { ManageService } from '../../../services/manage.service';

@Component({
  selector: 'app-modal-request-off',
  templateUrl: './modal-request-off.component.html',
  styleUrls: ['./modal-request-off.component.css']
})
export class ModalRequestOffComponent implements OnChanges {
  @Input() isVisibleModal: boolean = false;
  @Input() requestList: any[] = [];
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private manageService: ManageService,
  ){}
  
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
}
