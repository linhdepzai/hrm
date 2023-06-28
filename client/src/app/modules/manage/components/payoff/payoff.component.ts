import { Component, OnInit } from '@angular/core';
import { Payoff } from 'src/app/interfaces/interfaceReponse';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Employee } from 'src/app/interfaces/interfaces';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PayoffService } from 'src/app/services/payoff.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-payoff',
  templateUrl: './payoff.component.html',
  styleUrls: ['./payoff.component.css']
})
export class PayoffComponent implements OnInit {
  payoffList: Payoff[] = [];
  visibleModal: boolean = false;
  data: Payoff | undefined;
  employeeList: Employee[] = [];
  confirmModal?: NzModalRef;
  mode: string = 'create';
  totalAmount: number = 0;

  constructor(
    private payoffService: PayoffService,
    private employeeService: EmployeeService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    ) { }

  ngOnInit(): void {
    this.payoffService.getAllPayoff();
    this.employeeService.getAllEmployee();
    this.payoffService.payoffList$.subscribe((data) => { this.payoffList = data });
    this.employeeService.employeeList$.subscribe((data) => { this.employeeList = data });
  }

  drop(event: CdkDragDrop<string[], string[], any>): void {
    const item = this.payoffList[event.previousIndex];
    this.payoffList.splice(event.previousIndex, 1);
    this.payoffList.splice(event.currentIndex, 0, item);
    this.payoffList = [...this.payoffList];
  }

  openModal(data: Payoff | undefined, mode: string) {
    this.visibleModal = true;
    this.data = data;
    this.mode = mode;
  }

  getUserName(id: string) {
    return this.employeeList.find(i => i.id == id)?.fullName;
  }

  searchName(id: string) {
    this.payoffService.payoffList$.subscribe((data) => {
      this.payoffList = data;
    });
    if (id != null) {
      this.payoffList = this.payoffList.filter(i => i.employeeId == id);
    };
  }

  deleteItem(id: string) {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete this movie?',
      nzContent: 'When clicked the OK button, this movie will be deleted system-wide!!!',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.payoffService.deletePayoff(id).subscribe((response) => {
            if (response.message == 'Removed') {
              const index = this.payoffService.payoffList$.value.findIndex((item) => item.id == id);
              this.payoffService.payoffList$.value.splice(index, 1);
              this.payoffService.payoffList$.next([...this.payoffService.payoffList$.value]);
            } else {
              this.notification.create('error', 'Failed!', '');
            }
          });
          setTimeout(resolve, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }
}
