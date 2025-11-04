import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { BaseResponseList } from '../interfaces/Common.inteface';
import { Genres } from '../interfaces/Genre.interface';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  constructor(private http: HttpClient) {}

  private url = environments.localhost + environments.endpoint_genre;

  listGenres(): Observable<BaseResponseList<Genres>> {
    return this.http.get<BaseResponseList<Genres>>(`${this.url}/list`);
  }
}
