import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from '../services/user-store.service';



export const authGuard: CanActivateFn = (route, state) => {
  let role : string = ""
  inject(UserStoreService).getRoleFromStore().subscribe(val => {role = val})
  if(inject(AuthService).isLoggedIn() && role === 'Admin'){
    return true;
  } else{
    inject(NgToastService).error({detail:"ERROR", summary:"Please login before accessing this page!"});
    inject(Router).navigate(['/login']);
    return false;
  }
  
};
