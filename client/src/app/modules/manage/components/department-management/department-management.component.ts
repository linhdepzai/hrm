import { Component } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Department } from 'src/app/interfaces/interfaces';
import { DepartmentService } from 'src/app/services/department.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-department-management',
  templateUrl: './department-management.component.html',
  styleUrls: ['./department-management.component.css']
})
export class DepartmentManagementComponent {
  departmentList: Department[] =[];
  isVisibleModal: boolean = false;
  data?: Department;
  mode: string = 'create';
  confirmModal?: NzModalRef;

  constructor(
    private departmentService: DepartmentService,
    private notification: NzNotificationService,
    private modal: NzModalService,
  ){}

  ngOnInit(): void {
    this.departmentService.getAllDepartment();
    this.departmentService.departmentList$.subscribe((data) => {
      this.departmentList = data;
    })
  }
  
  drop(event: CdkDragDrop<string[], string[], any>): void {
    const item = this.departmentList[event.previousIndex];
    this.departmentList.splice(event.previousIndex, 1);
    this.departmentList.splice(event.currentIndex, 0, item);
    this.departmentList = [...this.departmentList];
  }

  openModal(data: Department | undefined, mode: string) {
    this.isVisibleModal = true;
    this.data = data;
    this.mode = mode;
  }

  deleteItem(id: string) {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete this movie?',
      nzContent: 'When clicked the OK button, this movie will be deleted system-wide!!!',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.departmentService.deleteDepartment(id).subscribe((response) => {
            if (response.message == 'Removed') {
              const index = this.departmentService.departmentList$.value.findIndex((item) => item.id == id);
              this.departmentService.departmentList$.value.splice(index, 1);
              this.departmentService.departmentList$.next([...this.departmentService.departmentList$.value]);
            } else {
              this.notification.create('error', 'Failed!', '');
            }
          });
          setTimeout(resolve, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }
}
