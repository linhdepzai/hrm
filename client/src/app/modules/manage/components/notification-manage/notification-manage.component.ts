import { Component, OnInit } from '@angular/core';
import Quill from 'quill';
import { ImageHandler } from 'ngx-quill-upload';
import { AccountService } from 'src/app/services/account.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
Quill.register('modules/imageHandler', ImageHandler);

@Component({
  selector: 'app-notification-manage',
  templateUrl: './notification-manage.component.html',
  styleUrls: ['./notification-manage.component.css']
})
export class NotificationManageComponent implements OnInit {
  previewImage: string | undefined = '';
  previewVisible = false;
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
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.notificationForm = this.fb.group({
      id: [null],
      actionId: [null, Validators.required],
      thumbnail: [null, Validators.required],
      title: [null, Validators.required],
      content: [null, Validators.required],
      createDate: [null, Validators.required],
      employee: this.fb.array([]),
    })
  }
}
