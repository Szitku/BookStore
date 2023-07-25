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

    this.userstore.setRoleFromStore(this.getRoleFromToken());
    this.userstore.setNameFromStore(this.getNameFromToken());
    this.userstore.setIdFromStore(this.getIdFromToken());

    this.toast.success({detail:"Success",summary:"Logged out"});
    this.route.navigate(['']);
  }


  storeToken(tokenValue: string){
    localStorage.setItem('token', tokenValue)
  }
  
  storeRefreshToken(tokenValue: string){
    localStorage.setItem('refreshtoken', tokenValue)
  }

  renewToken(TokenApi : TokenApiModel){
    return this.http.post<any>(`${this.ApiURL}/api/Login/refresh`,TokenApi);
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
    if(this.userPayLoad && typeof(this.userPayLoad.unique_name) === 'string') return this.userPayLoad.unique_name
    return '';
  }

  getRoleFromToken() : string{
    if(this.userPayLoad && typeof(this.userPayLoad.role) === 'string') return this.userPayLoad.role
    return 'User';
  }

  getIdFromToken() : number{
    if(this.userPayLoad && typeof(this.userPayLoad.nameid) === 'string') return parseInt(this.userPayLoad.nameid)
    return 0;
  }


}
