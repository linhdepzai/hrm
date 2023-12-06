import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Job } from 'src/app/interfaces/interfaceReponse';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.css'],
})
export class CareerComponent implements OnInit {
  jobList: Job[] = [];

  constructor(
    private jobService: JobService,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.jobService.getAllJob();
    this.jobService.jobList$.subscribe((data) => {
      this.jobList = data.filter((i) => i.visible == true);
    });
  }

  applyNow() {
    (<HTMLInputElement>document.getElementById('apply')).scrollIntoView({behavior: 'smooth'});
  }

  viewDetail(id: string) {
    this.router.navigate(['recuitment/' + id]);
  }

  copyToClipboard(id: string) {
    navigator.clipboard.writeText(document.location.href + '/' + id);
    this.message.success('Copy to clipboard!');
  }
}
