import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { BaseResponse, BaseResponseList } from '../interfaces/Common.inteface';
import { StatisticsResponse } from '../interfaces/Statistics.interface';
import { request } from 'http';
import {
  ConversationRequest,
  ConversationResponse,
} from '../interfaces/Conversation.interface';
import {
  AnxietyEvaluationRequest,
  AnxietyEvaluationResponse,
} from '../interfaces/AnxietyEvaluation.interface';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private http: HttpClient) {}

  private urlAnxiety =
    environments.localhostStats + environments.endpoint_anxietyEvaluation;
  private urlConversation =
    environments.localhostStats + environments.endpoint_conversationEvaluation;

  //AnxietyEvaluation
  createAnxietyEvaluation(
    data: AnxietyEvaluationRequest
  ): Observable<BaseResponse<AnxietyEvaluationResponse>> {
    return this.http.post<BaseResponse<AnxietyEvaluationResponse>>(
      `${this.urlAnxiety}/create-anxietyevaluation`,
      data
    );
  }

  listWeekAnxietyGradesByUserId(
    id: number,
    date: string
  ): Observable<BaseResponseList<StatisticsResponse>> {
    const params = new HttpParams().set('id', id).set('date', date);
    return this.http.get<BaseResponseList<StatisticsResponse>>(
      `${this.urlAnxiety}/list-week-grades`,
      { params }
    );
  }

  listMonthAnxietyGradesByUserId(
    id: number,
    date: string
  ): Observable<BaseResponseList<StatisticsResponse>> {
    const params = new HttpParams().set('id', id).set('date', date);
    return this.http.get<BaseResponseList<StatisticsResponse>>(
      `${this.urlAnxiety}/list-month-grades`,
      { params }
    );
  }

  //ConversationEvaluation
  createConversation(
    data: ConversationRequest
  ): Observable<BaseResponse<ConversationResponse>> {
    return this.http.post<BaseResponse<ConversationResponse>>(
      `/create-conversation`,
      data
    );
  }

  listWeekConversationGradesByUserId(
    id: number,
    date: string
  ): Observable<BaseResponseList<StatisticsResponse>> {
    const params = new HttpParams().set('id', id).set('date', date);
    return this.http.get<BaseResponseList<StatisticsResponse>>(
      `${this.urlConversation}/list-week-grades`,
      { params }
    );
  }

  listMonthConversationGradesByUserId(
    id: number,
    date: string
  ): Observable<BaseResponseList<StatisticsResponse>> {
    const params = new HttpParams().set('id', id).set('date', date);
    return this.http.get<BaseResponseList<StatisticsResponse>>(
      `${this.urlConversation}/list-month-grades`,
      { params }
    );
  }
}
