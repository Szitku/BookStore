import { Injectable } from '@angular/core';
import { Book } from '../models/bookmodel';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private orders$ = new BehaviorSubject<Map<Book,number>>(new Map<Book,number>());
  constructor() { }

  public getOrders() : Observable<Map<Book,number>>{
    return this.orders$.asObservable();
  }

  public addOrder(book : Book,amount : number) : void{
    let orders = this.orders$.getValue();

    if(!orders.has(book)){
      orders.set(book,amount);
    }else{
      let oldvalue = orders.get(book) ?? 0;
      orders.set(book,oldvalue + amount);
    }
    console.log(orders);
    this.orders$.next(orders);
  }

  public removeAmountOrder(book : Book) : void {
    let orders = this.orders$.getValue();
    
    let oldvalue = orders.get(book) ?? 0;
    let newvalue = oldvalue - 1;

    if(newvalue <= 0){
      orders.delete(book);
    } else {
      orders.set(book,newvalue);
    }
    this.orders$.next(orders);
  }

  public deleteOrder(book : Book) : void {
    let orders = this.orders$.getValue();
    orders.delete(book);
    this.orders$.next(orders);
  }


}
