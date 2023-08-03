import { Injectable } from '@angular/core';
import { Book } from '../models/bookmodel';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private orders$ = new BehaviorSubject<Map<string,number>>(new Map<string,number>());
  constructor() { }

  public getOrders() : Observable<Map<string,number>>{
    return this.orders$.asObservable();
  }


  public addOrder(book : Book,amount : number) : void{
    let orders = this.orders$.getValue();
    let stringBook = JSON.stringify(book);


    if(!orders.has(stringBook)){
      orders.set(stringBook,amount);
    }else{
      let oldvalue = orders.get(stringBook) ?? 0;
      orders.set(stringBook,oldvalue + amount);
    }
    console.log(orders);
    this.orders$.next(orders);
  }

  public removeAmountOrder(book : Book) : void {
    let orders = this.orders$.getValue();
    let stringBook = JSON.stringify(book);
    console.log(orders);
    let oldvalue = orders.get(stringBook) ?? 0;
    let newvalue = oldvalue - 1;

    if(newvalue <= 0){
      orders.delete(stringBook);
    } else {
      orders.set(stringBook,newvalue);
    }
    this.orders$.next(orders);
  }

  public deleteOrder(book : Book) : void {
    let orders = this.orders$.getValue();
    let stringBook = JSON.stringify(book);

    orders.delete(stringBook);
    this.orders$.next(orders);
  }


}
