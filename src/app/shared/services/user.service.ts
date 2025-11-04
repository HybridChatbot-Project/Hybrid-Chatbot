import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { BaseResponse } from '../interfaces/Common.inteface';
import { UserResponse } from '../interfaces/User.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  private url = environments.localhost + environments.endpoint_user;

  findUserById(id: number): Observable<BaseResponse<UserResponse>> {
    return this.http.get<BaseResponse<UserResponse>>(
      `${this.url}/find-user/${id}`
    );
  }
}
