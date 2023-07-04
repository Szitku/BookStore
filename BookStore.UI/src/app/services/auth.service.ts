import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  ApiURL = environment.apiURL;
  constructor(private http: HttpClient,private route:Router,private toast:NgToastService) { }


  register(userObj:any){
    return this.http.post<any>(`${this.ApiURL}/api/Login/register`,userObj);
  }

  login(userobj:any){
    return this.http.post<any>(`${this.ApiURL}/api/Login/authenticate`,userobj);
  }

  logout(){
    localStorage.clear();
    this.toast.success({detail:"Success",summary:"Logged out"});
    this.route.navigate(['login']);
  }

  storeToken(tokenValue: string){
    localStorage.setItem('token', tokenValue)
  }

  getToken(){
    return localStorage.getItem('token')
  }

  isLoggedIn() : boolean{
    return !!localStorage.getItem('token')
  }

}
