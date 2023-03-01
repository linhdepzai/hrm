import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/interfaces/interfaceRequest';
import { ManageService } from '../../../services/manage.service';

@Component({
  selector: 'app-working-time',
  templateUrl: './working-time.component.html',
  styleUrls: ['./working-time.component.css']
})
export class WorkingTimeComponent implements OnInit {
  isVisibleModal: boolean = false;
  employeeList = new Observable<Employee[]>();
  itemWorkingTime: any;

  constructor(
    private manageService: ManageService,
  ) { }

  ngOnInit(): void {
    this.employeeList = this.manageService.employeeList$;
  }

  changeStatusWorkingTime(data: any) {
    this.itemWorkingTime = data;
    this.isVisibleModal = true;
  }

  getUserName(id: string) {
    let name: any;
    this.manageService.employeeList$
      .subscribe((data: any[]) => {
        name = data.find(d => d.id == id)?.fullName;
      });
    return name;
  }

  refresh() { }

  calcTime(startTime: any, endTime: any) {
    const total = endTime.substring(0, 2) - startTime.substring(0, 2);
    const totalMinute = (endTime.substring(3, 5) - startTime.substring(3, 5)) / 60;
    return total + totalMinute;
  }
}
