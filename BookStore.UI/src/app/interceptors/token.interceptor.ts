import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { TokenApiModel } from '../models/token-apimodel';

@Injectable()
export class Tokeninterceptor implements HttpInterceptor {

  constructor(private auth : AuthService,private toast:NgToastService,private router : Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const mytoken = this.auth.getToken();
    if(mytoken){
      request = request.clone({
        setHeaders:{Authorization:`Bearer ${mytoken}`}
      });
    }
    
    return next.handle(request).pipe(
      catchError((err) => {
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
            return this.handleUnAuthError(request,next);
          }
        }
        return throwError(() => err);
      })
    );
  }

  handleUnAuthError(req : HttpRequest<any>, next: HttpHandler){
    let tokenApiModel : TokenApiModel = {
      accessToken : this.auth.getToken(),
      refreshToken : this.auth.getRefreshToken()
    };
    return this.auth.renewToken(tokenApiModel).pipe(
      switchMap((data:TokenApiModel) => {
        this.auth.storeRefreshToken(data.refreshToken);
        this.auth.storeToken(data.accessToken);
        req = req.clone({
          setHeaders:{Authorization:`Bearer ${data.accessToken}`}
        });
        return next.handle(req);
      }),
      catchError(() =>{
        return throwError(() => {
          this.toast.warning({detail:"Warning",summary:"Token is expired, Login again"});
          this.router.navigate(['login']);
        })
      })
    )
  }
}
