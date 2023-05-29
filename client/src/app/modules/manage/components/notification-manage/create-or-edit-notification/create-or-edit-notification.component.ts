import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { ImageHandler } from 'ngx-quill-upload';
import Quill from 'quill';
import { Observable, Observer } from 'rxjs';
import { Employee } from 'src/app/interfaces/interfaces';
import { AccountService } from 'src/app/services/account.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { NotificationService } from 'src/app/services/notification.service';
const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
Quill.register('modules/imageHandler', ImageHandler);

@Component({
  selector: 'app-create-or-edit-notification',
  templateUrl: './create-or-edit-notification.component.html',
  styleUrls: ['./create-or-edit-notification.component.css']
})
export class CreateOrEditNotificationComponent implements OnInit {
  previewImage: string | undefined = '';
  previewVisible = false;
  fileList: NzUploadFile[] = [];
  employeeList = new Observable<Employee[]>();
  selectEmployee: string[] = [];
  editorOptions = {
    imageHandler: {
      upload: (file: any) => {
        return new Promise((resolve, reject) => {
          if (
            file.type === 'image/jpeg' ||
            file.type === 'image/png' ||
            file.type === 'image/jpg'
          ) {
            return this.accountService.changeAvatar(file)
              .toPromise().then((res: any) => {
                if (res.statusCode == 200) {
                  resolve(res.data[0].fileUrl);
                }
              })
              .catch((err: any) => {
                return reject('Upload Failed');
              });
          }
          else {
            return reject('Unsupported type image');
          }
        })
      }
    }
  }

  notificationForm!: FormGroup;

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };
  constructor(
    private accountService: AccountService,
    private employeeService: EmployeeService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.employeeService.getAllEmployee();
    this.employeeList = this.employeeService.employeeList$;
    this.initForm();
    this.notificationForm.reset();
    this.employee.clear();
    this.route.params.subscribe((params) => {
      if (params['id'] != 'create') {
        this.notificationService.getOnlyNotification(params['id']).subscribe((response) => {
          this.notificationForm.patchValue(response.data[0]);
          response.data[0].employee.forEach((item: any) => {
            this.selectEmployee.push(item.employeeId)
            const employeeForm = this.fb.group({ employeeId: [null] });
            employeeForm.patchValue(item);
            this.employee.push(employeeForm);
          })
        });
      }
    });
  }

  initForm() {
    this.notificationForm = this.fb.group({
      id: [null],
      actionId: [null, Validators.required],
      thumbnail: [null, Validators.required],
      title: [null, Validators.required],
      content: [null, Validators.required],
      employee: this.fb.array([]),
    })
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
      if (!isJpgOrPng) {
        this.message.error('You can only upload JPG file!');
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

  onSearch(value: string[]) {
    this.selectEmployee = value;
  }

  get employee(): FormArray{
    return this.notificationForm.get('employee') as FormArray;
  }

  handleSubmit() {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    if (this.fileList.length > 0) {
      this.notificationForm.controls['thumbnail'].setValue(this.fileList[this.fileList.length - 1].thumbUrl);
    } else {
      this.notification.warning('Missing thumbnail!', '');
    }
    this.notificationForm.controls['actionId'].setValue(user.id);
    this.employee.clear();
    this.selectEmployee.forEach((item) => {
      const userForm = this.fb.group({ employeeId: item });
      this.employee.push(userForm);
    });
    if (this.notificationForm.valid) {
      this.notificationService.saveNotification(this.notificationForm.value)
        .subscribe((response) => {
          if (response.statusCode == 200) {
            this.notification.success('Successfully!', response.data.title);
          }
        });
    } else {
      Object.values(this.notificationForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
