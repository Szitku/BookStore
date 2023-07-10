import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { resetpasswordmodel } from '../models/resetpasswordmodel';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private baseUrl : string = environment.apiURL;
  constructor(private http:HttpClient) { }

  sendResetPasswordLink(email : string){
    return this.http.post<any>(`${this.baseUrl}/api/login/sendresetemail/${email}`, {})
  }

  resetPassword(resetPasswordmodel : resetpasswordmodel){
    return this.http.post<any>(`${this.baseUrl}/api/login/resetpassword`, resetPasswordmodel)
  }
}
