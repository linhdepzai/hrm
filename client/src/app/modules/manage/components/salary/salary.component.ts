import { Component, OnInit } from '@angular/core';
import { Salary } from 'src/app/interfaces/interfaceReponse';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Level } from 'src/app/enums/Enum';
import { DataService } from 'src/app/services/data.service';
import { SalaryService } from 'src/app/services/salary.service';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.css']
})
export class SalaryComponent implements OnInit {
  visibleModal: boolean = false;
  salaryList: Salary[] = [];
  level = Level;

  constructor(
    private salaryService: SalaryService,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.dataService.getAllPosition();
    this.salaryService.getAllSalary();
    this.salaryService.salaryList$.subscribe((data) => {
      this.salaryList = data;
    });
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

  searchName(id: string) {

  }
}
