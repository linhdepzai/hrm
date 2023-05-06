import { Component, OnInit } from '@angular/core';
import { PayoffService } from '../../services/payoff.service';
import { Payoff } from 'src/app/interfaces/interfaceReponse';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from 'src/app/interfaces/interfaces';

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
  mode: string = 'create';

  constructor(
    private payoffService: PayoffService,
    private employeeService: EmployeeService,
  ) { }

  ngOnInit(): void {
    this.payoffService.getAllPayoff();
    this.payoffService.payoffList$.subscribe((data) => {
      this.payoffList = data;
    });
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
}
