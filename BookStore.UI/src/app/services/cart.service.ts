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
      let old = orders.get(book) ?? 0;
      orders.set(book,old + amount);
    }
    this.orders$.next(orders);
  }

}
