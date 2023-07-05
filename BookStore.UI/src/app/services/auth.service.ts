import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { environment } from 'src/environments/environment';
import { user } from '../models/user';
import { Observable } from 'rxjs/internal/Observable';
import { JwtHelperService } from '@auth0/angular-jwt'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private ApiURL = environment.apiURL;
  private userPayLoad:any;

  constructor(private http: HttpClient,private route:Router,private toast:NgToastService) { 
    this.userPayLoad = this.decodeToken();
  }


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

  decodeToken(){
    const jwthelper = new JwtHelperService();
    const token = this.getToken()!;

    console.log(jwthelper.decodeToken(token))
    return jwthelper.decodeToken(token)
  }

  getNameFromToken(){
    if(this.userPayLoad)
    return this.userPayLoad.unique_name;
  }

  getRoleFromToken() : string{
    if(this.userPayLoad && typeof(this.userPayLoad.role) === 'string') return this.userPayLoad.role
    return "User";
  }

}
