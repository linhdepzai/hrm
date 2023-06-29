import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Position } from 'src/app/interfaces/interfaceReponse';
import { DataService } from 'src/app/services/data.service';
import { PositionService } from 'src/app/services/position.service';

@Component({
  selector: 'app-create-position-modal',
  templateUrl: './create-position-modal.component.html',
  styleUrls: ['./create-position-modal.component.css']
})
export class CreatePositionModalComponent implements OnInit, OnChanges {
  @Input() isVisibleModal: boolean = false;
  @Input() data: Position | undefined;
  @Input() mode: string= 'create';
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  positionForm!: FormGroup;
  iconList: string[] = [];
  title: string = 'New Position';

  constructor(
    private positionService: PositionService,
    private dataService: DataService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
  ) { 
    this.initForm();
  }

  ngOnInit(): void {
    this.dataService.iconList.subscribe((data) => { this.iconList = data });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.positionForm.reset();
    this.positionForm.controls['color'].setValue('#00ff00');
    if (this.mode == 'create') {
      this.title = 'New Position';
    } else {
      this.title = 'Edit Position';
      this.positionForm.patchValue(this.data!);
    }
  }

  initForm() {
    this.positionForm = this.fb.group({
      id: [null],
      name: [null, Validators.required],
      color: ['#00ff00'],
    });
  }

  submitForm() {
    if (this.positionForm.valid) {
      this.positionService.savePosition(this.positionForm.value)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.notification.success('Successfully!', 'Position ' + response.data.name);
          if (this.positionForm.value.id) {
            this.positionService.positionList$.value.splice(this.positionService.positionList$.value.findIndex((item) => item.id === response.data.id), 1, response.data);
            this.positionService.positionList$.next([...this.positionService.positionList$.value]);
          } else {
            this.positionService.positionList$.next([response.data, ...this.positionService.positionList$.value]);
          };
          this.handleCancel();
        };
      });
    } else {
      Object.values(this.positionForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  randomColor() {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    this.positionForm.controls['color'].setValue(randomColor);
  }

  handleCancel(): void {
    this.resetForm();
    this.cancel.emit();
  }

  resetForm() {
    this.positionForm.reset();
    this.positionForm.controls['color'].setValue('#00ff00');
  }
}
