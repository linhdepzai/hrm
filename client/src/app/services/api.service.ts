import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DepartmentResponse, LoginResponse, OnLeaveResponse } from '../interfaces/interfaceReponse';
import { Employee, Login } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  themeColor: BehaviorSubject<string> = new BehaviorSubject<string>('#096dd9');

  constructor(private httpClient: HttpClient) { }

  login(payload: Login): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(environment.baseUrl + 'account/login', payload);
  }

  getAllDepartment(): Observable<DepartmentResponse[]> {
    return this.httpClient.get<DepartmentResponse[]>(environment.baseUrl + 'department/getAll');
  }

  saveDepartment(payload: any): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'department/save', payload);
  }

  deleteDepartment(id: any): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + 'department/delete?id=' + id);
  }

  getAllEmployee(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'employee/getAll');
  }

  saveEmployee(payload: Employee): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'employee/save', payload);
  }

  updateStatusEmployee(payload: any): Observable<any> {
    return this.httpClient.put(environment.baseUrl + 'employee/updateStatus', payload);
  }

  deleteEmployee(id: any): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + 'employee/delete?id=' + id);
  }

  requestOnLeave(payload: any): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'onleave/requestLeave', payload);
  }

  getAllOnLeave(): Observable<OnLeaveResponse[]> {
    return this.httpClient.get<OnLeaveResponse[]>(environment.baseUrl + 'onleave/getAll');
  }

  deleteOnLeave(id: string): Observable<string> {
    return this.httpClient.delete<string>(environment.baseUrl + 'onleave/delete?id=' + id);
  }
}
