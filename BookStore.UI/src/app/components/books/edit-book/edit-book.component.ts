import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { Book } from 'src/app/models/bookmodel';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {
  
  book : Book = {
    title: '',
    author: '',
    cover: '',
    synopsis: '',
    price: 0
  }

  constructor(private route : ActivatedRoute,private bookService:BooksService,private router : Router){}
  
  ngOnInit(): void {
      this.getBookbyId();
  }

  updateBook(){
      this.bookService.updateBook(this.book)
      .subscribe({
        next : (response) => {
          this.router.navigate(['books']);
        }
      })
  }

  deleteBook(){
    if(this.book.id){
      this.bookService.deleteBook(this.book.id).subscribe({
        next : (response) => {
          this.router.navigate(['books']);
        }
      })
    }
  }

  getBookbyId(){
    this.route.paramMap.subscribe({
      next : (params) => {
        const id = Number(params.get('id'));
        if(id) {
          this.bookService.getBookbyId(id)
          .subscribe({
            next : (book) => {
              this.book = book;
              this.book = this.trimBook(this.book);
            }
          })
        }
      }
    })
  }

  trimBook(book : Book) : Book {
    book.title = book.title.trim();
    book.author = book.author.trim();
    book.cover = book.cover.trim();
    book.synopsis = book.synopsis.trim();
    return book;
  }
}
