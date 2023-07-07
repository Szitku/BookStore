import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { environment } from 'src/environments/environment';
import { user } from '../models/user';
import { Observable } from 'rxjs/internal/Observable';
import { JwtHelperService } from '@auth0/angular-jwt'
import { UserStoreService } from './user-store.service';
import { TokenApiModel } from '../models/token-apimodel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private ApiURL = environment.apiURL;
  private userPayLoad:any;
  

  constructor(private http: HttpClient,private route:Router,private toast:NgToastService,private userstore : UserStoreService) { 
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
  
  storeRefreshToken(tokenValue: string){
    localStorage.setItem('refreshtoken', tokenValue)
  }

  getToken(){
    let token = localStorage.getItem('token');
    if(token === null) token = "";
    return token;
  }

  getRefreshToken(){
    let token = localStorage.getItem('refreshtoken');
    if(token === null) token = "";
    return token;
  }

  isLoggedIn() : boolean{
    return !!localStorage.getItem('token')
  }

  decodeToken(){
    const jwthelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwthelper.decodeToken(token)
  }

  getNameFromToken(){
    if(this.userPayLoad)
    return this.userPayLoad.unique_name;
  }

  getRoleFromToken(){
    if(this.userPayLoad && typeof(this.userPayLoad.role) === 'string') return this.userPayLoad.role
    return 'User';
  }

  renewToken(TokenApi : TokenApiModel){
    return this.http.post<any>(`${this.ApiURL}/api/Login/refresh`,TokenApi);
  }

}
