import { Component, OnInit } from '@angular/core';
import { Position } from 'src/app/interfaces/interfaceReponse';
import { PositionService } from 'src/app/services/position.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-position-management',
  templateUrl: './position-management.component.html',
  styleUrls: ['./position-management.component.css']
})
export class PositionManagementComponent implements OnInit {
  positionList: Position[] =[];
  isVisiblePositionModal: boolean = false;
  data?: Position;
  mode: string = 'create';
  confirmModal?: NzModalRef;

  constructor(
    private positionService: PositionService,
    private notification: NzNotificationService,
    private modal: NzModalService,
  ){}

  ngOnInit(): void {
    this.positionService.getAllPosition();
    this.positionService.positionList$.subscribe((data) => {
      this.positionList = data;
    })
  }
  
  drop(event: CdkDragDrop<string[], string[], any>): void {
    const item = this.positionList[event.previousIndex];
    this.positionList.splice(event.previousIndex, 1);
    this.positionList.splice(event.currentIndex, 0, item);
    this.positionList = [...this.positionList];
  }

  openModal(data: Position | undefined, mode: string) {
    this.isVisiblePositionModal = true;
    this.data = data;
    this.mode = mode;
  }

  deleteItem(id: number) {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete this movie?',
      nzContent: 'When clicked the OK button, this movie will be deleted system-wide!!!',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.positionService.deletePosition(id).subscribe((response) => {
            if (response.message == 'Removed') {
              const index = this.positionService.positionList$.value.findIndex((item) => item.id == id);
              this.positionService.positionList$.value.splice(index, 1);
              this.positionService.positionList$.next([...this.positionService.positionList$.value]);
            } else {
              this.notification.create('error', 'Failed!', '');
            }
          });
          setTimeout(resolve, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }
}
