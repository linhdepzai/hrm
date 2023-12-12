import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer, map } from 'rxjs';
import { Job } from 'src/app/interfaces/interfaceReponse';
import { CandidateService } from 'src/app/services/candidate.service';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  candidateForm!: FormGroup;
  jobList: Job[] = [];
  fileList!: NzUploadFile;

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService,
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.createCandidateForm();
    this.jobService.jobList$.subscribe((data) => {
      this.jobList = data.filter(i => i.visible == true);
      this.candidateForm.controls['jobId'].setValue(this.jobList[0]?.id);
    });
  }

  createCandidateForm() {
    this.candidateForm = this.fb.group({
      jobId: [null, Validators.required],
      fullName: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
      option: [null, Validators.required],
      fileCV: [null, Validators.required],
    });
    this.candidateForm.reset();
    this.candidateForm.controls['option'].setValue('cv');
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      this.fileList = file;
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf' || file.type === 'application/msword';
      if (!isJpgOrPng) {
        this.message.error('You can only upload JPG || PDF || DOC file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.message.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  handleSubmit() {
    this.candidateForm.controls['fileCV'].setValue(this.fileList.name);
    if (this.candidateForm.valid) {
      this.candidateService.create(this.candidateForm.value).subscribe((response) => {
        if (response.statusCode == 200) {
          this.message.success('Successfully!');
          this.createCandidateForm();
        }});
    } else {
      Object.values(this.candidateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  downloadCV = (file: NzUploadFile) => {
    this.candidateService.downloadCV(file.response.message);
  };
}
