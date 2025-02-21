import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { Bank, Level, OptionRequestOff, Priority, ProjectType, StatusCandidate, StatusTask } from '../enums/Enum';
import { ApiResponse } from '../interfaces/interfaceReponse';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  themeColor: BehaviorSubject<string> = new BehaviorSubject<string>('#a08c0e');
  public levelList = new BehaviorSubject<{ value: Level, label: string }[]>([]);
  public bankList = new BehaviorSubject<Bank[]>([]);
  public iconList = new BehaviorSubject<string[]>([]);
  public requestOffList = new BehaviorSubject<{ value: OptionRequestOff, label: string }[]>([]);
  public priorityList = new BehaviorSubject<{ value: Priority, label: string }[]>([]);
  public statusTaskList = new BehaviorSubject<{ value: StatusTask, label: string }[]>([]);
  public projectTypeList = new BehaviorSubject<{ value: ProjectType, label: string }[]>([]);
  public statusCandidate = new BehaviorSubject<{ value: StatusCandidate, label: string }[]>([]);

  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService,
  ) {
    const themeColor = JSON.parse(localStorage.getItem('themeColor') || sessionStorage.getItem('themeColor') || '[]');
    this.themeColor.next(themeColor.length == 0 ? '#a08c0e' : themeColor);
    this.dataList();
  }

  getStatistical(): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'Statistical/totalEmployee')
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }));
  }

  getStatisticalCandidate(): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'Statistical/get-all-candidate')
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }));
  }

  getStatisticalJob(): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'Statistical/get-all-job')
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }));
  }

  getStatisticPayOffForMonth(): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(environment.baseUrl + 'Statistical/payoffForMonth')
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }));
  }

  dataList() {
    this.levelList.next([
      { value: Level.Intern, label: 'Intern' },
      { value: Level.Fresher, label: 'Fresher' },
      { value: Level.Junior, label: 'Junior' },
      { value: Level.Middle, label: 'Middle' },
      { value: Level.Senior, label: 'Senior' }]);
    this.requestOffList.next([
      { value: OptionRequestOff.OffMorning, label: 'Off Morning' },
      { value: OptionRequestOff.OffAfternoon, label: 'Off Afternoon' },
      { value: OptionRequestOff.OffFullDay, label: 'Off Full Day' },
      { value: OptionRequestOff.Late, label: 'Late' },
      { value: OptionRequestOff.LeaveEarly, label: 'Leave Early' }]);
    this.bankList.next([Bank.Techcombank, Bank.ACB, Bank.Agribank,
    Bank.BIDV, Bank.DongABank, Bank.MBB, Bank.MSB, Bank.OCB,
    Bank.Sacombank, Bank.ShinhanBank, Bank.TPBank, Bank.VCB,
    Bank.VietCapitalBank, Bank.VietinBank, Bank.VPBank, Bank.HDBank,
    Bank.VIETCOMBANK, Bank.NamABank, Bank.VIB]);
    this.priorityList.next([
      { value: Priority.Low, label: 'Low' },
      { value: Priority.Normal, label: 'Normal' },
      { value: Priority.Medium, label: 'Medium' },
      { value: Priority.High, label: 'High' },
      { value: Priority.Urgent, label: 'Urgent' }]);
    this.statusTaskList.next([
      { value: StatusTask.Open, label: 'Open' },
      { value: StatusTask.InProgress, label: 'In Progress' },
      { value: StatusTask.Resolve, label: 'Resolve' },
      { value: StatusTask.Closed, label: 'Closed' },
      { value: StatusTask.Reopened, label: 'Reopened' }]);
    this.projectTypeList.next([
      { value: ProjectType.FF, label: 'Fixed Free' },
      { value: ProjectType.NB, label: 'Non-Billable' },
      { value: ProjectType.ODC, label: 'ODC' },
      { value: ProjectType.Product, label: 'Product' },
      { value: ProjectType.TM, label: 'Time&Materials' },
      { value: ProjectType.Training, label: 'Training' },
    ]);
    this.statusCandidate.next([
      { value: StatusCandidate.Waiting, label: 'Waiting'},
      { value: StatusCandidate.PassCV, label: 'Pass CV'},
      { value: StatusCandidate.PassInterview, label: 'Pass Interview'},
      { value: StatusCandidate.Rejected, label: 'Rejected'},
      { value: StatusCandidate.Success, label: 'Success'},
      { value: StatusCandidate.Failure, label: 'Failure'}
    ]);
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
