import { Component, OnInit } from '@angular/core';
import { Position, Salary } from 'src/app/interfaces/interfaceReponse';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Level } from 'src/app/enums/Enum';
import { DataService } from 'src/app/services/data.service';
import { SalaryService } from 'src/app/services/salary.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.css']
})
export class SalaryComponent implements OnInit {
  visibleModal: boolean = false;
  salaryList: Salary[] = [];
  level = Level;
  levelList = new Observable<{ value: Level; label: string }[]>();
  positionList = new Observable<Position[]>();
  filterSalaryCode!: string | null;
  filterSalaryLevel!: Level | null;
  filterSalaryPosition!: number | null;

  constructor(
    private salaryService: SalaryService,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.dataService.getAllPosition();
    this.salaryService.getAllSalary();
    this.salaryService.salaryList$.subscribe((data) => { this.salaryList = data });
    this.levelList = this.dataService.levelList;
    this.positionList = this.dataService.positionList;
  }

  drop(event: CdkDragDrop<string[], string[], any>): void {
    const item = this.salaryList[event.previousIndex];
    this.salaryList.splice(event.previousIndex, 1);
    this.salaryList.splice(event.currentIndex, 0, item);
    this.salaryList = [...this.salaryList];
  }

  formatVND(price: number) {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'VND' }).format(price)
  }

  getDepartmentName(id: number) {
    return this.dataService.positionList.value.find(i => i.id == id)?.name;
  }

  filterSalary() {
    this.salaryService.salaryList$.subscribe((data) => { this.salaryList = data });
    if(this.filterSalaryCode != null){
      this.salaryList = this.salaryList.filter(i => i.id == this.filterSalaryCode);
    }
    if(this.filterSalaryLevel != null){
      this.salaryList = this.salaryList.filter(i => i.level == this.filterSalaryLevel);
    }
    if(this.filterSalaryPosition != null){
      this.salaryList = this.salaryList.filter(i => i.position == this.filterSalaryPosition);
    }
  }

  searchName(id: string) {
    this.filterSalaryCode = id;
    this.filterSalary();
  }

  filterLevel(level: Level) {
    this.filterSalaryLevel = level;
    this.filterSalary();
  }

  filterPosition(position: number) {
    this.filterSalaryPosition = position;
    this.filterSalary();
  }
}
