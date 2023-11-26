import { Component, OnInit } from '@angular/core';
import { Evaluate } from 'src/app/interfaces/interfaceReponse';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Employee } from 'src/app/interfaces/interfaces';
import { Level } from 'src/app/enums/Enum';
import { Observable } from 'rxjs';
import { EvaluateService } from 'src/app/services/evaluate.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.css']
})
export class EvaluateComponent implements OnInit {
  evaluateList: Evaluate[] = [];
  level = Level;
  visibleModal: boolean = false;
  data!: Evaluate;
  employeeList = new Observable<Employee[]>();
  monthList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  yearList: number[] = [];
  filterEvaluateName!: string | null;
  filterEvaluateMonth = new Date().getMonth() + 1;
  filterEvaluateYear = new Date().getFullYear();

  constructor(
    private evaluateService: EvaluateService,
    private employeeService: EmployeeService,
  ) { }

  ngOnInit(): void {
    this.employeeService.getAllEmployee();
    this.employeeList = this.employeeService.employeeList$;
    this.evaluateService.getAllEvaluate(this.filterEvaluateMonth, this.filterEvaluateYear);
    this.evaluateService.evaluateList$.subscribe((data) => {
      this.evaluateList = data;
    });
    for (let i = -10; i <= 10; i++) {
      this.yearList = [...this.yearList, new Date().getFullYear() + i];
    };
  }

  drop(event: CdkDragDrop<string[], string[], any>): void {
    const item = this.evaluateList[event.previousIndex];
    this.evaluateList.splice(event.previousIndex, 1);
    this.evaluateList.splice(event.currentIndex, 0, item);
    this.evaluateList = [...this.evaluateList];
  }

  getUserName(id: string) {
    return this.employeeService.employeeList$.value.find(d => d.appUserId == id)?.fullName;
  }

  openModal(data: Evaluate) {
    this.data = data;
    this.visibleModal = true;
  }

  filterList() {
    this.evaluateService.getAllEvaluate(this.filterEvaluateMonth, this.filterEvaluateYear);
    if (this.filterEvaluateName != null) this.evaluateList.filter(i => i.userId == this.filterEvaluateName);
  }

  searchName(id: string) {
    this.filterEvaluateName = id;
    this.filterList();
  }

  searchMonth(month: number) {
    this.filterEvaluateMonth = month;
    this.filterList();
  }

  searchYear(year: number) {
    this.filterEvaluateYear = year;
    this.filterList();
  }
}
