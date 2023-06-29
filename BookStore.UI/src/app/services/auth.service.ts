import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  ApiURL = environment.apiURL;
  constructor(private http: HttpClient) { }


  register(userObj:any){
    return this.http.post<any>(`${this.ApiURL}/api/Login/register`,userObj);
  }

  login(userobj:any){
    return this.http.post<any>(`${this.ApiURL}/api/Login/authenticate`,userobj);
  }

}
