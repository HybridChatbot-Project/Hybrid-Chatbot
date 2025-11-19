import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { BaseResponse, BaseResponseList } from '../interfaces/Common.inteface';
import {
  ConversationCloseRequest,
  ConversationResponse,
} from '../interfaces/Conversation.interface';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  constructor(private http: HttpClient) {}

  private url = environments.localhost + environments.endpoint_conversation;

  listConversationsByUserId(
    id: number
  ): Observable<BaseResponseList<ConversationResponse>> {
    return this.http.get<BaseResponseList<ConversationResponse>>(
      `${this.url}/list-by-user/${id}`
    );
  }

  createConversation(
    userId: number
  ): Observable<BaseResponse<ConversationResponse>> {
    return this.http.post<BaseResponse<ConversationResponse>>(
      `${this.url}/create-conversation/${userId}`,
      {}
    );
  }

  closeConversationById(
    data: ConversationCloseRequest
  ): Observable<BaseResponse<ConversationResponse>> {
    return this.http.put<BaseResponse<ConversationResponse>>(
      `${this.url}/close-conversation`,
      data
    );
  }

  deleteConversation(id: number): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(
      `${this.url}/delete-conversation/${id}`
    );
  }
}
