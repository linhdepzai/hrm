import { Component } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Candidate } from 'src/app/interfaces/interfaceReponse';
import { CandidateService } from 'src/app/services/candidate.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css']
})
export class CandidateComponent {
  candidateList: Candidate[] = [];
  visibleModal: boolean = false;
  data: Candidate | undefined;
  confirmModal?: NzModalRef;
  mode: string = 'create';
  totalAmount: number = 0;

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    ) { }

  ngOnInit(): void {
    this.candidateService.getAllCandidate();
    this.jobService.getAllJob();
    this.candidateService.candidateList$.subscribe((data) => { this.candidateList = data });
  }

  drop(event: CdkDragDrop<string[], string[], any>): void {
    const item = this.candidateList[event.previousIndex];
    this.candidateList.splice(event.previousIndex, 1);
    this.candidateList.splice(event.currentIndex, 0, item);
    this.candidateList = [...this.candidateList];
  }

  openModal(data: Candidate | undefined, mode: string) {
    this.visibleModal = true;
    this.data = data;
    this.mode = mode;
  }

  getJobPosition(id: string) {
    return this.jobService.jobList$.value.find(d => d.id == id)?.jobTitle;
  }

  searchName(fullName: string) {
    this.candidateService.candidateList$.subscribe((data) => {
      this.candidateList = data;
    });
    if (fullName != null) {
      this.candidateList = this.candidateList.filter(i => i.fullName.toLowerCase().indexOf(fullName.toLowerCase()));
    };
  }

  deleteItem(id: string) {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to delete this movie?',
      nzContent: 'When clicked the OK button, this movie will be deleted system-wide!!!',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.candidateService.delete(id).subscribe((response) => {
            if (response.message == 'Removed') {
              const index = this.candidateService.candidateList$.value.findIndex((item) => item.id == id);
              this.candidateService.candidateList$.value.splice(index, 1);
              this.candidateService.candidateList$.next([...this.candidateService.candidateList$.value]);
            } else {
              this.notification.create('error', 'Failed!', '');
            }
          });
          setTimeout(resolve, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }

  download(filename: string) {
    this.candidateService.downloadCV(filename);
  }
}
