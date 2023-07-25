import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { Book } from 'src/app/models/bookmodel';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css']
})
export class FrontpageComponent implements OnInit {
  
  books: Book[] = []

  constructor(private BookService : BooksService,private toast : NgToastService){}

  ngOnInit(): void {
    this.BookService.getBooks().subscribe({
      next : (res) => {
        this.books = res;
        console.log(this.books);
      },
      error : (err) => {
        this.toast.error({detail:"Error",summary:err.message,duration:3000});
      }
    })
  }

  addCart(book : Book) : void {

  }
}
