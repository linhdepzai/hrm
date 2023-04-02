import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Priority, ProjectType, StatusTask } from 'src/app/enums/Enum';
import { CreateProject } from 'src/app/interfaces/interfaces';
import { ManageService } from 'src/app/modules/manage/services/manage.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-general-project',
  templateUrl: './general-project.component.html',
  styleUrls: ['./general-project.component.css']
})
export class GeneralProjectComponent implements OnInit {
  @Input() backForm!: CreateProject;
  @Output() next = new EventEmitter<CreateProject>();
  generalForm!: FormGroup;
  priorityList = new Observable<{ value: Priority, label: string }[]>();
  statusTaskList = new Observable<{ value: StatusTask, label: string }[]>();
  projectTypeList = new Observable<{ value: ProjectType, label: string }[]>();
  constructor(
    private manageService: ManageService,
    private dataService: DataService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.priorityList = this.dataService.priorityList;
    this.statusTaskList = this.dataService.statusTaskList;
    this.projectTypeList = this.dataService.projectTypeList;
  }

  initForm() {
    this.generalForm = this.fb.group({
      id: [null],
      projectName: [null, Validators.required],
      description: [null],
      projectType: [ProjectType.FF, Validators.required],
      projectCode: [null, Validators.required],
      deadlineDate: [null, Validators.required],
      priorityCode: [Priority.Medium, Validators.required],
      statusCode: [StatusTask.Open, Validators.required],
    });
    this.manageService.project$.subscribe(data => {
      this.generalForm.patchValue(data);
    });
    this.generalForm.patchValue(this.backForm);
  }

  handleSubmit() {
    if (this.generalForm.valid) {
      this.next.emit(this.generalForm.value);
    } else {
      Object.values(this.generalForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
