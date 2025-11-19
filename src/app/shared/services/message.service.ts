import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'process';
import { environments } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { BaseResponseList } from '../interfaces/Common.inteface';
import { MessageResponse } from '../interfaces/Chat.interface';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private http: HttpClient) {}

  private url = environments.localhost + environments.endpoint_message;

  listMessagesByConversationId(
    id: number
  ): Observable<BaseResponseList<MessageResponse>> {
    return this.http.get<BaseResponseList<MessageResponse>>(
      `${this.url}/find-by-conversation/${id}`
    );
  }

  findFirstLineConversation(id: number): Observable<string> {
    return this.http.get(`${this.url}/find-first-line/${id}`, {
      responseType: 'text' as 'json',
    }) as Observable<string>;
  }
}
