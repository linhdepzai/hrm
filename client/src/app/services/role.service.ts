import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { ApiResponse } from '../interfaces/interfaceReponse';
import { environment } from 'src/environments/environment';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  roleList$ = new BehaviorSubject<any[]>([]);
  baseUrl = environment.baseUrl + 'Role/';

  constructor(
    private httpClient: HttpClient,
    private message: NzMessageService,
  ) { }

  getAllRole() {
    return this.httpClient.get<ApiResponse>(this.baseUrl + 'get-all')
      .pipe(catchError((err) => {
        this.message.error('Server not responding!!!', { nzDuration: 3000 });
        return of(err);
      }))
      .subscribe((response) => {
        if (response.statusCode == 200) {
          this.roleList$.next(response.data);
        }
      });
  }
}
