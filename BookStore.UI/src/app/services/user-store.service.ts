import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

 
@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private name$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");
  private id$ = new BehaviorSubject<number>(0);


  constructor() { }

  public getRoleFromStore(){
    return this.role$.asObservable();
  }

  public setRoleFromStore(role : string){
    this.role$.next(role);
  }

  public getNameFromStore(){
    return this.name$.asObservable();
  }

  public setNameFromStore(name : string){
    this.name$.next(name);
  }

  public getIdFromStore(){
    return this.id$.asObservable();
  }

  public setIdFromStore(id : number){
    this.id$.next(id);
  }

  
}
