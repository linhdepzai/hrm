import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee, Login } from '../interfaces/interfaceRequest';
import { LoginResponse } from '../interfaces/interfaceResponse';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  themeColor: BehaviorSubject<string> = new BehaviorSubject<string>('#096dd9');

  constructor(private httpClient: HttpClient) { }

  login(payload: Login): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(environment.baseUrl + 'Authenticate', payload);
  }

  getAllDepartment(): Observable<any>{
    return this.httpClient.get(environment.baseUrl + 'department/getAll');
  }

  saveDepartment(payload: any): Observable<any>{
    return this.httpClient.post(environment.baseUrl + 'department/save', payload);
  }
  
  deleteDepartment(id: any): Observable<any>{
    return this.httpClient.delete(environment.baseUrl + 'department/delete?id=' + id);
  }

  getAllEmployee(): Observable<any>{
    return this.httpClient.get(environment.baseUrl + 'employee/getAll');
  }

  saveEmployee(payload: Employee): Observable<any>{
    return this.httpClient.post(environment.baseUrl + 'employee/save', payload);
  }

  updateStatusEmployee(payload: any): Observable<any>{
    return this.httpClient.put(environment.baseUrl + 'employee/updateStatus', payload);
  }
  
  deleteEmployee(id: any): Observable<any>{
    return this.httpClient.delete(environment.baseUrl + 'employee/delete?id=' + id);
  }
  
  requestOnLeave(payload: any): Observable<any>{
    return this.httpClient.post(environment.baseUrl + 'onleave/requestLeave', payload);
  }
}
