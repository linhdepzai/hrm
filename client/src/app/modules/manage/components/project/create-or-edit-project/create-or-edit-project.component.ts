import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Priority, ProjectType, StatusTask } from 'src/app/enums/Enum';
import { CreateProject } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-create-or-edit-project',
  templateUrl: './create-or-edit-project.component.html',
  styleUrls: ['./create-or-edit-project.component.css']
})
export class CreateOrEditProjectComponent {
  @Input() visibleCreateOrEditProject: boolean = false;
  @Output() cancel = new EventEmitter<boolean>();
  current = 0;
  generalForm!: CreateProject;

  actionPage(value: CreateProject, action: string) {
    this.current = action == 'next' ? 1 : 0;
    this.generalForm = value;
  }

  handleCancel() {
    this.generalForm = { 
      id: null,
      projectName: '',
      description: '',
      projectType: ProjectType.FF,
      projectCode: '',
      deadlineDate: null,
      priorityCode: Priority.Medium,
      statusCode: StatusTask.Open,
      members: [],
    };
    this.current = 0;
    this.cancel.emit();
  }
}
