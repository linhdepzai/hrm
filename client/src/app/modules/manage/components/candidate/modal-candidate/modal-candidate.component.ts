import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { StatusCandidate } from 'src/app/enums/Enum';
import { Candidate } from 'src/app/interfaces/interfaceReponse';
import { CandidateService } from 'src/app/services/candidate.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-modal-candidate',
  templateUrl: './modal-candidate.component.html',
  styleUrls: ['./modal-candidate.component.css'],
})
export class ModalCandidateComponent {
  @Input() visible: boolean = false;
  @Input() data: Candidate | undefined;
  @Input() mode: string = 'create';
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  title: string = 'View';
  isEdit: boolean = false;
  candidateForm!: FormGroup;
  statusCandidate = new Observable<{ value: StatusCandidate, label: string }[]>();

  constructor(
    private candidateService: CandidateService,
    private dataService: DataService,
    private notification: NzNotificationService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.statusCandidate = this.dataService.statusCandidate;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.candidateForm.reset();
    this.isEdit = true;
    if (this.mode == 'create') {
      this.title = 'Create';
      this.candidateForm.enable();
    } else {
      this.candidateForm.patchValue(this.data!);
      this.changeMode();
    }
  }

  initForm() {
    this.candidateForm = this.fb.group({
      id: [null],
      jobId: [null, Validators.required],
      fullName: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
      evaluate: [null, Validators.required],
      status: [null, Validators.required],
    });
  }

  changeMode() {
    this.isEdit = !this.isEdit;
    this.title =
      (this.isEdit ? 'Edit: ' : 'View: ') + this.data?.fullName;
    if (this.isEdit) {
      this.candidateForm.enable();
    } else {
      this.candidateForm.disable();
    }
  }

  submitForm() {
    if (this.candidateForm.valid) {
      this.candidateService
        .update(this.candidateForm.value)
        .subscribe((response) => {
          if (response.statusCode == 200) {
            this.notification.success('Successfully!', '');
            this.candidateService.candidateList$.value.splice(
              this.candidateService.candidateList$.value.findIndex(
                (item) => item.id === response.data.id
              ),
              1,
              response.data
            );
            this.candidateService.candidateList$.next([
              ...this.candidateService.candidateList$.value,
            ]);
            this.cancel.emit();
          }
        });
    } else {
      Object.values(this.candidateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  close() {
    this.cancel.emit();
  }
}
