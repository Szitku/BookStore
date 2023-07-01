import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from 'src/app/models/bookmodel';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  
  newBook: Book = {
    id: 0,
    title: '',
    author: '',
    cover: '',
    synopsis: '',
    price: 0
  }

  constructor(private bookService : BooksService, private router : Router){}
 
  ngOnInit(): void {
     
 }

 addBook(){
    this.bookService.addBook(this.newBook)
    .subscribe({
      next : () => {
        this.router.navigate(['books']);
      },
      error : (response) => {
        console.log(response);
      }
    })
 }

 

 
}
