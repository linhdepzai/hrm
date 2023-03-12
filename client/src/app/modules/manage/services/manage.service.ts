import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { Bank, Level, OptionOnLeave, Position } from 'src/app/enums/Enum';
import { DepartmentResponse, OnLeaveResponse, TimeWorkingResponse } from 'src/app/interfaces/interfaceReponse';
import { Department, Employee } from 'src/app/interfaces/interfaces';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ManageService {
  public employeeList$ = new BehaviorSubject<Employee[]>([]);
  public departmentList$ = new BehaviorSubject<DepartmentResponse[]>([]);
  public onLeaveList$ = new BehaviorSubject<OnLeaveResponse[]>([]);
  public timeWorkingList$ = new BehaviorSubject<TimeWorkingResponse[]>([]);
  public levelList = new BehaviorSubject<{ value: Level, label: string }[]>([]);
  public positionList = new BehaviorSubject<{ value: Position, label: string }[]>([]);
  public bankList = new BehaviorSubject<Bank[]>([]);
  public iconList = new BehaviorSubject<string[]>([]);
  public requestOffList = new BehaviorSubject<{ value: OptionOnLeave, label: string }[]>([]);
  public loading = new BehaviorSubject<boolean>(false);

  constructor(
    private apiService: ApiService,
    private notification: NzNotificationService,
    private message: NzMessageService,
  ) {
    this.loading.next(true);
    this.dataList();
    this.getAllDepartment();
    this.getAllEmployee();
    this.getAllOnLeave();
    this.getAllTimeWorking();
    this.loading.next(false);
  }

  getAllDepartment() {
    this.apiService
      .getAllDepartment()
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response: DepartmentResponse[]) => {
        this.departmentList$.next(response);
      });
  }

  saveDepartment(payload: Department) {
    this.apiService
      .saveDepartment(payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', 'An error occurred during execution!');
        return of(err);
      }))
      .subscribe((response) => {
        if (response.id) {
          this.notification.success('Successfully!', 'Department ' + response.name);
          if (payload.id) {
            this.departmentList$.value.splice(this.departmentList$.value.findIndex((item) => item.id === response.id), 1, response);
            this.departmentList$.next([...this.departmentList$.value]);
          } else {
            this.departmentList$.next([response, ...this.departmentList$.value]);
          };
        };
      });
  }

  getAllEmployee() {
    this.apiService
      .getAllEmployee()
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response) => {
        this.employeeList$.next(response);
      });
  }

  saveEmployee(payload: Employee) {
    this.apiService
      .saveEmployee(payload)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', 'An error occurred during execution!');
        return of(err);
      }))
      .subscribe((response) => {
        if (response.id) {
          this.notification.success('Successfully!', `Create ${Level[response.level]} ${Position[response.position]} ${response.fullName}`);
          if (payload.id) {
            this.employeeList$.value.splice(this.employeeList$.value.findIndex((item) => item.id === response.id), 1, response);
            this.employeeList$.next([...this.employeeList$.value]);
          } else {
            this.employeeList$.next([response, ...this.employeeList$.value]);
          };
        };
      });
  }

  deleteEmployee(id: string) {
    this.apiService
      .deleteEmployee(id)
      .subscribe(() => {
        const index = this.employeeList$.value.findIndex((item) => item.id == id);
        this.employeeList$.value.splice(index, 1);
        this.employeeList$.next([...this.employeeList$.value]);
      });
  }

  requestOnLeave(form: any) {
    this.apiService
      .requestOnLeave(form)
      .pipe(catchError((err) => {
        this.notification.error('Error!!!', 'An error occurred during execution!');
        return of(err);
      }))
      .subscribe((response) => {
        this.getAllOnLeave();
        this.notification.success('Successfully!!!', `There are ${response.onLeave.length} items have been added!`);
      });
  }

  getAllOnLeave() {
    this.apiService
      .getAllOnLeave()
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response: OnLeaveResponse[]) => {
        this.onLeaveList$.next(response);
      });
  }

  deleteOnLeave(id: string) {
    this.apiService
      .deleteOnLeave(id)
      .subscribe((response) => {
        if (response.length == 36) {
          const index = this.onLeaveList$.value.findIndex((item) => item.id == response);
          this.onLeaveList$.value.splice(index, 1);
          this.onLeaveList$.next([...this.onLeaveList$.value]);
          this.notification.success('Successfully!', 'This item has been deleted!');
        } else {
          this.notification.error('Error!!!', 'An error occurred during execution!');
        }
      });
  }

  getAllTimeWorking() {
    this.apiService
      .getAllTimeWorking()
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response: TimeWorkingResponse[]) => {
        const data = response.sort((a, b) => {
          return new Date(b.applyDate).getTime() - new Date(a.applyDate).getTime();
        });
        this.timeWorkingList$.next(data);
      });
  }






















































  dataList() {
    this.levelList.next([
      { value: Level.Intern, label: 'Intern' },
      { value: Level.Fresher, label: 'Fresher' },
      { value: Level.Junior, label: 'Junior' },
      { value: Level.Middle, label: 'Middle' },
      { value: Level.Senior, label: 'Senior' }]);
    this.positionList.next([
      { value: Position.Dev, label: 'Dev' },
      { value: Position.QA, label: 'QA' },
      { value: Position.BA, label: 'BA' },
      { value: Position.PM, label: 'PM' },
      { value: Position.DevOps, label: 'DevOps' },
      { value: Position.DataEngineer, label: 'DataEngineer' },
      { value: Position.ScrumMaster, label: 'ScrumMaster' }]);
    this.requestOffList.next([
      { value: OptionOnLeave.OffMorning, label: 'Off Morning' },
      { value: OptionOnLeave.OffAfternoon, label: 'Off Afternoon' },
      { value: OptionOnLeave.OffFullDay, label: 'Off Full Day' },
      { value: OptionOnLeave.Late, label: 'Late/Leave Early' }]);
    this.bankList.next([Bank.Techcombank, Bank.ACB, Bank.Agribank,
    Bank.BIDV, Bank.DongABank, Bank.MBB, Bank.MSB, Bank.OCB,
    Bank.Sacombank, Bank.ShinhanBank, Bank.TPBank, Bank.VCB,
    Bank.VietCapitalBank, Bank.VietinBank, Bank.VPBank, Bank.HDBank,
    Bank.VIETCOMBANK, Bank.NamABank, Bank.VIB]);
    this.iconList.next(['house', 'magnifying-glass', 'user', 'check',
      'download', 'image', 'phone', 'bars', 'envelope', 'star',
      'location-dot', 'music', 'wand-magic-sparkles', 'heart',
      'arrow-right', 'circle-xmark', 'bomb', 'poo', 'camera-retro',
      'xmark', 'cloud', 'comment', 'caret-up', 'truck-fast', 'pen-nib',
      'arrow-up', 'hippo', 'face-smile', 'calendar-days', 'paperclip',
      'shield-halved', 'file', 'bell', 'cart-shopping', 'clipboard',
      'filter', 'circle-info', 'arrow-up-from-bracket', 'bolt', 'car',
      'ghost', 'mug-hot', 'circle-user', 'pen', 'umbrella', 'gift', 'film',
      'list', 'gear', 'trash', 'circle-up', 'circle-down', 'inbox', 'rotate-right',
      'lock', 'headphones', 'barcode', 'tag', 'book', 'bookmark', 'print',
      'camera', 'font', 'video', 'circle-half-stroke', 'droplet', 'pen-to-square',
      'share-from-square', 'plus', 'minus', 'share', 'circle-exclamation',
      'fire', 'eye', 'eye-slash', 'plane', 'magnet', 'hand', 'folder',
      'folder-open', 'money-bill', 'thumbs-up', 'thumbs-down', 'comments',
      'lemon', 'key', 'thumbtack', 'gears', 'paper-plane', 'code', 'globe',
      'truck', 'city', 'ticket', 'tree', 'wifi', 'paint-roller', 'bicycle',
      'sliders', 'brush', 'hashtag', 'flask', 'briefcase', 'compass',
      'dumpster-fire', 'person', 'person-dress', 'address-book', 'bath',
      'handshake', 'snowflake', 'right-to-bracket', 'earth-americas',
      'cloud-arrow-up', 'binoculars', 'palette', 'layer-group', 'users',
      'gamepad', 'business-time', 'feather', 'sun', 'link', 'pen-fancy',
      'fish', 'bug', 'shop', 'mug-saucer', 'landmark', 'poo-storm',
      'chart-simple', 'shirt', 'anchor', 'quote-left', 'bag-shoppping',
      'gauge', 'code-compare', 'user-secret', 'stethoscope', 'car-side',
      'hand-holding-heart', 'truck-font', 'cable-car', 'mountain-sun',
      'location-pin', 'info', 'user-minus', 'calendar', 'cart-plus',
      'clock', 'circle', 'play', 'cross', 'backward', 'handshake-slash',
      'chevron-up', 'passport', 'question', 'pencil', 'phone-volume',
      'upload', 'strikethrough', 'credit-card', 'street-view', 'database',
      'copy', 'mobile', 'square', 'sort', 'forward', 'hourglass-start',
      'newspaper', 'notes-medical', 'table', 'building', 'stop', 'store',
      'flag', 'file-excel', 'network-wired']);
  }
}
