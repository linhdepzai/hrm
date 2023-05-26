import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Output() cancel = new EventEmitter();
  previewImage: string | undefined = '';
  previewVisible = false;
  uploadUrl: string = '';
  fileList: NzUploadFile[] = [];

  constructor(
    private notification: NzNotificationService,
    private message: NzMessageService,
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
    this.uploadUrl = `https://localhost:5001/api/account/changeAvatar/${user.id}`;
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

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  handleSubmit() {
    const file = this.fileList[this.fileList.length - 1];
    this.accountService.changeAvatar(file.originFileObj as File)
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.notification.success('Successfully!', '');
          this.cancel.emit();
        }
      });
  }

  handleCancel() {
    this.cancel.emit();
  }
}
