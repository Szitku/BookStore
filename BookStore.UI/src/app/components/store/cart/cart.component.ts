import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/models/bookmodel';
import { CartService } from 'src/app/services/cart.service';



@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit,OnDestroy {

  orders = new Map<Book,number>()
  private ordersSub : Subscription | undefined;

  constructor(private cart : CartService) {}

  ngOnInit(): void {
    this.ordersSub = this.cart.getOrders().subscribe({next : (ordermap) => {
      if(ordermap){
        this.orders = ordermap;
      }
    }})

    
  }

  ngOnDestroy(): void {
    if(this.ordersSub){
      this.ordersSub.unsubscribe();
    }
  }

  buyOrder(orders : Map<Book,number>){
    
  }

  addOneOrderAmount(book : Book):void{
    this.cart.addOrder(book,1);
  }

  removeOneOrderAmount(book : Book):void {
    this.cart.removeAmountOrder(book);
  }

  deleteOrder(book : Book) : void {
    this.cart.deleteOrder(book);
  }

  mapToArray(map: Map<Book, number>) {
    return Array.from(map.entries()).map(([key, value]) => ({ key, value }));
  }


}
