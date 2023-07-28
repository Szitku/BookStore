import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/models/bookmodel';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-viewbook',
  templateUrl: './viewbook.component.html',
  styleUrls: ['./viewbook.component.css']
})
export class ViewbookComponent implements OnInit {

  book : Book = {} as Book;
  bookfound : boolean = false;
  constructor(private BookService : BooksService, private route : ActivatedRoute){}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next : (params) => {
        const id = Number(params.get('id'));
        if(id){
          this.BookService.getBookbyId(id).subscribe({
            next : (res) => {
              this.book = res;
              this.bookfound = true;
              console.log(this.book);
            },
            error : (err) => {
              this.bookfound = false;
              console.log(err.error.message);
            }
          })
        }
      }
    })
  }

  addCart(book : Book) : void {

  }

}
