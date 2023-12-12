import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Job } from 'src/app/interfaces/interfaceReponse';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css'],
})
export class JobDetailComponent implements OnInit {
  job!: Job;

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.jobService.get(params['id']).subscribe((res) => {
        this.job = res.data[0];
      });
    });
  }

  applyNow() {
    (<HTMLInputElement>document.getElementById('apply')).scrollIntoView({
      behavior: 'smooth',
    });
  }

  copyToClipboard() {
    navigator.clipboard.writeText(document.location.href);
    this.message.success('Copy to clipboard!');
  }
}
