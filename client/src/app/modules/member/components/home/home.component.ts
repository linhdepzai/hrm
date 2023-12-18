import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'node_modules/chart.js'
import { DataService } from 'src/app/services/data.service';
Chart.register(...registerables)

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  statistical: any;
  jobList: any[] = [];
  candidateList: any[] = [];
  totalCandidate: string = '0';

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.fetchData();
    this.chart();
  }

  fetchData() {
    this.dataService.getStatistical()
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.statistical = response.data;
          new Chart("payoffChart", {
            type: 'pie',
            data: {
              labels: ['Punish', 'Bounty'],
              datasets: [{
                label: 'Punish',
                data: [this.statistical.totalPunish, this.statistical.totalBounty],
                backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgb(255, 99, 132)','rgb(54, 162, 235)'],
                hoverOffset: 4
              }]
            }
          });
        };
      });
    this.dataService.getStatisticalCandidate().subscribe((res) => {
      this.candidateList = res.data;
      this.totalCandidate = res.message;
    });
    this.dataService.getStatisticalJob().subscribe((res) => {
      this.jobList = res.data;
    });
  }

  chart() {
    let punish: number[] = [];
    let bounty: number[] = [];
    this.dataService.getStatisticPayOffForMonth()
      .subscribe((response) => {
        if (response.statusCode == 200) {
          (response.data as any[]).forEach((item) => {
            punish.push(item.punish);
            bounty.push(item.bounty);
          })
          new Chart("payoffYearChart", {
            type: 'bar',
            data: {
              labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
              datasets: [{
                label: 'Punish',
                data: punish,
                backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgb(255, 99, 132)'],
                borderWidth: 1
              },
              {
                label: 'Bounty',
                data: bounty,
                backgroundColor: ['rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgb(54, 162, 235)'],
                borderWidth: 1
              }]
            }
          });
        };
      });
  }

  getPercent(percent: number) {
    return percent == -2147483548 ? '0%' : percent + '%';
  }

  getStatusCandidate(status: number) {
    return this.dataService.statusCandidate.value.find(i => i.value == status)?.label;
  }

}
