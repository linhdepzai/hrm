import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Evaluate } from 'src/app/interfaces/interfaceReponse';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class EvaluateService {
  evaluateList$ = new BehaviorSubject<Evaluate[]>([]);

  constructor(
    private apiService: ApiService,
  ) { }

  getAllEvaluate() {
    this.apiService
      .getAllEvaluate()
      .subscribe((response) => {
        this.evaluateList$.next(response.data);
      });
  }
}
