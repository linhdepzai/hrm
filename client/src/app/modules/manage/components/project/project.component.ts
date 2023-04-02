import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectResponse } from 'src/app/interfaces/interfaceReponse';
import { ManageService } from '../../services/manage.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  visibleCreateOrEditProject: boolean = false;
  projectList = new Observable<ProjectResponse[] | any>();

  constructor(
    private manageService: ManageService,
  ) { }

  ngOnInit(): void {
    this.projectList = this.manageService.projectList$;
  }

  openModal() {
    this.manageService.getAllEmployee();
    this.visibleCreateOrEditProject = true;
  }

  closeModal() {
    this.visibleCreateOrEditProject = false;
  }

  editProject(projectId: string) {
    this.manageService.getOnlyProject(projectId);
    this.visibleCreateOrEditProject = true;
  }
}
