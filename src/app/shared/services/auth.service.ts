import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environment';
import { UserRequest, UserResponse } from '../interfaces/User.interface';
import { Observable } from 'rxjs';
import { BaseResponse } from '../interfaces/Common.inteface';
import { LoginRequest } from '../interfaces/Security.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = environments.localhost + environments.endpoint_auth;

  constructor(private http: HttpClient) {}

  registerUser(data: UserRequest): Observable<BaseResponse<UserResponse>> {
    return this.http.post<BaseResponse<UserResponse>>(
      `${this.url}/register`,
      data
    );
  }

  loginUser(data: LoginRequest): Observable<BaseResponse<string>> {
    return this.http.post<BaseResponse<string>>(`${this.url}/login`, data);
  }
}
