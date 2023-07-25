import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';

export const loggedinguardGuard: CanActivateFn = (route, state) => {
  if(inject(AuthService).isLoggedIn() === true){
    console.log(inject(Router).url)
    inject(Router).navigate([".."]);
    inject(NgToastService).error({detail:"ERROR", summary:"You are already logged in can't go there"});
    return false;
  } else {
    return true;
  }
};
