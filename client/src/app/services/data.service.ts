import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Bank, Level, OptionOnLeave, Position, Priority, ProjectType, StatusTask } from '../enums/Enum';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  themeColor: BehaviorSubject<string> = new BehaviorSubject<string>('#096dd9');
  public levelList = new BehaviorSubject<{ value: Level, label: string }[]>([]);
  public positionList = new BehaviorSubject<{ value: Position, label: string }[]>([]);
  public bankList = new BehaviorSubject<Bank[]>([]);
  public iconList = new BehaviorSubject<string[]>([]);
  public requestOffList = new BehaviorSubject<{ value: OptionOnLeave, label: string }[]>([]);
  public priorityList = new BehaviorSubject<{ value: Priority, label: string }[]>([]);
  public statusTaskList = new BehaviorSubject<{ value: StatusTask, label: string }[]>([]);
  public projectTypeList = new BehaviorSubject<{ value: ProjectType, label: string }[]>([]);

  constructor() {
    this.dataList();
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
    ])
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
