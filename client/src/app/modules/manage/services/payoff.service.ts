import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Payoff } from 'src/app/interfaces/interfaceReponse';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PayoffService {
  payoffList$ = new BehaviorSubject<Payoff[]>([]);

  constructor(
    private apiService: ApiService,
  ) { }

  getAllPayoff() {
    this.apiService
      .getAllPayoff()
      .subscribe((response) => {
        this.payoffList$.next(response.data);
      });
  }
}
