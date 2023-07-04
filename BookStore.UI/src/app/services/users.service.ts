import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { user } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private ApiURL = environment.apiURL;
  constructor(private http: HttpClient) { }

  getUsers() : Observable<user[]>{
    return this.http.get<user[]>(`${this.ApiURL}/api/Login/getUsers`)
  }
}
