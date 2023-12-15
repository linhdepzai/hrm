import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SalaryService } from 'src/app/services/salary.service';

@Component({
  selector: 'app-confirm-salary',
  templateUrl: './confirm-salary.component.html',
  styleUrls: ['./confirm-salary.component.css']
})
export class ConfirmSalaryComponent implements OnInit {

  constructor(
    private route: ActivatedRoute, 
    private salaryService: SalaryService, 
    private noti: NzNotificationService,
    private router: Router,
    ) {}

  ngOnInit(): void {
    this.route.queryParams
      .subscribe((params: any) => {
        this.salaryService.confirmSalary(params.id, params.action)
          .subscribe((response) => {
            this.noti.success(response.message,'');
            this.router.navigate(['member/profile']);
        });
      }
    );
  }

}
