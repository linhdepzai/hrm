import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginForm, LoginResponse } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.baseUrl + 'services/app/';
  constructor(private httpClient: HttpClient) { }

  login(payload: LoginForm): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(this.baseUrl + 'Authenticate', payload);
  }
}
