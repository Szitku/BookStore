import { CanActivateFn, Router } from '@angular/router';
import { UserStoreService } from '../services/user-store.service';
import { inject } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';

export const adminGuard: CanActivateFn = (route, state) => {
  let role : string = ""
  inject(UserStoreService).getRoleFromStore().subscribe(val => {role = val})
  console.log(role);
  
  if(role === 'User'){
    return true;
  } else{
    inject(NgToastService).error({detail:"ERROR", summary:"Admins can't access this page"});
    inject(Router).navigate(["/books"]);
    return false;
  }
};
