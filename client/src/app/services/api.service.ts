import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Status } from '../enums/Enum';
import { DepartmentResponse, LoginResponse, OnLeaveResponse, ProjectResponse, TimeKeepingResponse, TimeWorkingResponse } from '../interfaces/interfaceReponse';
import { CheckinOrCheckout, CreateProject, Employee, Login } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  

  constructor(private httpClient: HttpClient) { }

  login(payload: Login): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(environment.baseUrl + 'account/login', payload);
  }

  requestChangeInfor(payload: Employee): Observable<Employee> {
    return this.httpClient.put<Employee>(environment.baseUrl + 'account/requestChangeInfor', payload);
  }

  updateStatusUserInfo(payload: {id: string, status: Status}): Observable<Employee> {
    return this.httpClient.put<Employee>(environment.baseUrl + 'employee/updateStatus', payload);
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

  getAllEmployee(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(environment.baseUrl + 'employee/getAll');
  }

  saveEmployee(payload: Employee): Observable<Employee> {
    return this.httpClient.post<Employee>(environment.baseUrl + 'employee/save', payload);
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

  getAllTimeWorking(): Observable<TimeWorkingResponse[]> {
    return this.httpClient.get<TimeWorkingResponse[]>(environment.baseUrl + 'timeworking/getAll');
  }

  getAllProject(): Observable<ProjectResponse[]>{
    return this.httpClient.get<ProjectResponse[]>(environment.baseUrl + 'project/getall');
  }

  getOnlyProject(projectId: string): Observable<CreateProject>{
    return this.httpClient.get<CreateProject>(environment.baseUrl + 'project/getAProject?projectId=' + projectId);
  }

  saveProject(payload: CreateProject): Observable<CreateProject>{
    return this.httpClient.post<CreateProject>(environment.baseUrl + 'project/save', payload);
  }

  getTimeKeepingForUser(id: string): Observable<TimeKeepingResponse[]>{
    return this.httpClient.get<TimeKeepingResponse[]>(environment.baseUrl + 'timekeeping/getTimeKeepingForUser?id=' + id);
  }

  checkinOrCheckout(payload: CheckinOrCheckout): Observable<TimeKeepingResponse>{
    return this.httpClient.post<TimeKeepingResponse>(environment.baseUrl + 'timekeeping/checkinOrCheckout', payload);
  }

  getAllRequestChangeInfo(): Observable<Employee[]>{
    return this.httpClient.get<Employee[]>(environment.baseUrl + 'employee/getAllRequestChangeInfo');
  }
}
