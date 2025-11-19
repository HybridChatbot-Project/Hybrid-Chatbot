import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiNewsResponseGeneral } from '../interfaces/MedicResources.interface';

@Injectable({
  providedIn: 'root',
})
export class MedicResourcesService {
  constructor(private http: HttpClient) {}

  private url: string =
    'https://newsdata.io/api/1/latest?apikey=' + environments.secretApiKeyNews;
  private search_parameters: string =
    '&q=relaxation techniques&category=health,lifestyle';

  searchArticles(): Observable<ApiNewsResponseGeneral> {
    return this.http.get<ApiNewsResponseGeneral>(
      `${this.url}${this.search_parameters}`
    );
  }

  searchArticlesNextPages(
    nextPage: string
  ): Observable<ApiNewsResponseGeneral> {
    return this.http.get<ApiNewsResponseGeneral>(
      `${this.url}${this.search_parameters}&page=${nextPage}`
    );
  }
}
