import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [CommonModule, NzToolTipModule],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {
  @Input() color: string = '';
  @Input() label: string = '';
  @Input() size: any;
  font: boolean = false;

  ngOnInit(): void {
    this.size !== undefined ? this.font = true : this.font = false;
    switch (this.label) {
      case 'Intern':
        this.color = '#665d1e';
        break;
      case 'Fresher':
        this.color = '#89cff0';
        break;
      case 'Junior':
        this.color = '#a57164';
        break;
      case 'Middle':
        this.color = '#8db600';
        break;
      case 'Senior':
        this.color = '#e52b50';
        break;
      case 'Dev':
        this.color = '#0099FF';
        break;
      case 'QA':
        this.color = '#FF66FF';
        break;
      case 'BA':
        this.color = '#009900';
        break;
      case 'PM':
        this.color = '#FF6600';
        break;
      case 'DevOps':
        this.color = '#003300';
        break;
      case 'DataEngineer':
        this.color = '#AAAAAA';
        break;
      case 'ScrumMaster':
        this.color = '#FF3300';
        break;

    }
  }
}
