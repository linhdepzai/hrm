import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IssueResponse } from 'src/app/interfaces/interfaceReponse';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  issueList = new Observable<IssueResponse[] | any>();

  constructor(
    private issueService: TaskService
  ){}
  
  ngOnInit(): void {
    this.issueService.getAllIssue();
    this.issueList = this.issueService.issueList$;
  }

  openModal() {}

  closeModal() {}

  editIssue(id: any) {}
}
