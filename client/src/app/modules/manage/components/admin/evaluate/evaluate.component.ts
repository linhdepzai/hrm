import { Component, OnInit } from '@angular/core';
import { EvaluateService } from '../../../services/evaluate.service';
import { Evaluate } from 'src/app/interfaces/interfaceReponse';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from 'src/app/interfaces/interfaces';
import { Level } from 'src/app/enums/Enum';

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

  constructor(
    private evaluateService: EvaluateService,
    private employeeService: EmployeeService,
  ){}

  ngOnInit(): void {
    this.evaluateService.getAllEvaluate();
    this.evaluateService.evaluateList$.subscribe((data) => {
      this.evaluateList = data;
    });
  }

  drop(event: CdkDragDrop<string[], string[], any>): void {
    const item = this.evaluateList[event.previousIndex];
    this.evaluateList.splice(event.previousIndex, 1);
    this.evaluateList.splice(event.currentIndex, 0, item);
    this.evaluateList = [...this.evaluateList];
  }

  getUserName(id: string) {
    let name: string | undefined;
    this.employeeService.employeeList$
      .subscribe((data: Employee[]) => {
        name = data.find(d => d.id == id)?.fullName;
      });
    return name;
  }

  openModal(data: Evaluate){
    this.data = data;
    this.visibleModal = true;
  }
}
