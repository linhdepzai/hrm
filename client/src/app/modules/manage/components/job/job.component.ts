import { Component } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Job } from 'src/app/interfaces/interfaceReponse';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { JobService } from 'src/app/services/job.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PositionService } from 'src/app/services/position.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent {
  jobList: Job[] = [];
  visibleModal: boolean = false;
  data: Job | undefined;
  confirmModal?: NzModalRef;
  mode: string = 'create';
  totalAmount: number = 0;

  constructor(
    private jobService: JobService,
    private positionService: PositionService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    ) { }

  ngOnInit(): void {
    this.positionService.getAllPosition();
    this.jobService.getAllJob();
    this.jobService.jobList$.subscribe((data) => { this.jobList = data });
  }

  drop(event: CdkDragDrop<string[], string[], any>): void {
    const item = this.jobList[event.previousIndex];
    this.jobList.splice(event.previousIndex, 1);
    this.jobList.splice(event.currentIndex, 0, item);
    this.jobList = [...this.jobList];
  }

  openModal(data: Job | undefined, mode: string) {
    this.visibleModal = true;
    this.data = data;
    this.mode = mode;
  }

  getJobPosition(id: string) {
    return this.jobService.jobList$.value.find(d => d.id == id)?.jobTitle;
  }

  searchName(jobTitle: string) {
    this.jobService.jobList$.subscribe((data) => {
      this.jobList = data;
    });
    if (jobTitle != null) {
      this.jobList = this.jobList.filter(i => i.jobTitle.toLowerCase().indexOf(jobTitle.toLowerCase()));
    };
  }

  getExpireDate(fromDate: Date, toDate: Date) {
    const today = new Date();
    if(today > new Date(toDate)) {
      return 'Expires';
    } else if (today < new Date(fromDate)) {
      return 'Upcomming';
    } else {
      return 'Happenning';
    }
  }

  deleteItem(id: string) {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete this movie?',
      nzContent: 'When clicked the OK button, this movie will be deleted system-wide!!!',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.jobService.delete(id).subscribe((response) => {
            if (response.message == 'Removed') {
              const index = this.jobService.jobList$.value.findIndex((item) => item.id == id);
              this.jobService.jobList$.value.splice(index, 1);
              this.jobService.jobList$.next([...this.jobService.jobList$.value]);
            } else {
              this.notification.create('error', 'Failed!', '');
            }
          });
          setTimeout(resolve, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }
}
