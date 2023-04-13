import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { Level, Position } from 'src/app/enums/Enum';
import { CreateProject, Employee } from 'src/app/interfaces/interfaces';
import { EmployeeService } from 'src/app/modules/manage/services/employee.service';
import { ProjectService } from 'src/app/modules/manage/services/project.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-team-project',
  templateUrl: './team-project.component.html',
  styleUrls: ['./team-project.component.css']
})
export class TeamProjectComponent implements OnInit {
  @Input() generalForm!: CreateProject;
  @Output() previous = new EventEmitter<CreateProject>();
  employeeList: Employee[] = [];
  memberList: { member: Employee, type: 1 | 2 }[] = [];
  position = Position;
  level = Level;
  positionList = new Observable<{ value: Position, label: string }[]>();
  memberForm!: FormGroup;

  constructor(
    private employeeService: EmployeeService,
    private projectService: ProjectService,
    private dataService: DataService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.positionList = this.dataService.positionList;
    this.memberForm = this.fb.group({
      members: this.fb.array([]),
    });
    this.employeeService.employeeList$.subscribe((data) => {
      this.employeeList = data;
    });
    if (this.generalForm.id != ('' || null)) {
      this.projectService.project$.subscribe((data) => {
        data.members.forEach((member) => {
          const user = this.employeeList.find(e => e.id == member.employeeId)!;
          this.actionMember(user, 'add');
        });
      });
    };
  }

  actionMember(user: Employee, action: string) {
    if (action == 'add') {
      const countPM = this.memberList.filter(item => item.type == 1).length;
      this.memberList = [{ member: user, type: countPM > 0 ? 2 : 1 }, ...this.memberList];
      const index = this.employeeList.findIndex((item) => item == user);
      this.employeeList.splice(index, 1);
      this.employeeList = [...this.employeeList];
    } else {
      this.employeeList = [...this.employeeList, user];
      const index = this.memberList.findIndex((item) => item.member == user);
      this.memberList.splice(index, 1);
      this.memberList = [...this.memberList];
    }
  }

  changeTypeMember(type: 1 | 2, user: Employee) {
    this.memberList.splice(this.memberList.findIndex((item) => item.member.id === user.id), 1, { member: user, type: type });
    this.memberList = [...this.memberList];
  }

  handlePrevious() {
    this.previous.emit(this.generalForm);
  }

  handleSubmit() {
    (this.memberForm.controls['members'] as FormArray).clear();
    const countPM = this.memberList.filter(item => item.type == 1).length;
    if (countPM != 1) {
      this.notification.warning('Failed!!!', 'Each project is only 1 pm!')
    } else {
      this.memberList.forEach((item) => {
        const memberForm = this.fb.group({
          employeeId: item.member.id,
          type: item.type,
        });
        (this.memberForm.controls['members'] as FormArray).push(memberForm);
      });
      this.generalForm.members = this.memberForm.value.members;
      console.log(this.generalForm)
      this.projectService.saveProject(this.generalForm);
    }
  }
}
