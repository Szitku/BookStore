import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
    id: 0,
    title: '',
    author: '',
    cover: '',
    synopsis: '',
    price: 0
  }

  editForm = new FormGroup({
    id: new FormControl('bookid',Validators.required),
    title: new FormControl('booktitle',Validators.required),
    author: new FormControl('bookauthor',Validators.required),
    cover: new FormControl('bookcover',Validators.required),
    synopsis: new FormControl('booksynopsis',Validators.required),
    price: new FormControl('bookprice',[
      Validators.min(1),Validators.required
    ]),
  })

  constructor(private route : ActivatedRoute,private bookService:BooksService,private router : Router,private fb : FormBuilder){}
  
  ngOnInit(): void {
      this.getBookbyId();
  }

  updateBook(){
    this.formToBook();
    if(this.editForm.valid){
      this.bookService.updateBook(this.book)
      .subscribe({
        next : (response) => {
          this.router.navigate(['books']);
        }
      })
    }else{
      this.validateAllFormFields(this.editForm);
    }
      
  }

  deleteBook(){
    if(this.book.id){
      this.bookService.deleteBook(this.book.id).subscribe({
        next : () => {
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
            next : (res) => {
              this.book = res;
              this.book = this.trimBook(this.book);
              this.bookToForm();
            }
          })
        }
      }
    })
  }

  private trimBook(book : Book) : Book {
    book.title = book.title.trim();
    book.author = book.author.trim();
    book.cover = book.cover.trim();
    book.synopsis = book.synopsis.trim();
    return book;
  }

  private validateAllFormFields(formGroup:FormGroup){
    Object.keys(formGroup.controls).forEach(field=>{
      const control = formGroup.get(field);
      if(control instanceof FormControl){
        control.markAsDirty({onlySelf:true});
      }else if(control instanceof FormGroup){
        this.validateAllFormFields(control)
      }
    })}
  private bookToForm(){
    this.editForm.get('id')?.setValue(this.book.id.toString());
    this.editForm.get('title')?.setValue(this.book.title);
    this.editForm.get('author')?.setValue(this.book.author);
    this.editForm.get('cover')?.setValue(this.book.cover);
    this.editForm.get('synopsis')?.setValue(this.book.synopsis);
    this.editForm.get('price')?.setValue(this.book.price.toString());
  }
  private formToBook(){
    // biztos van jobb megoldas
    let ind : string | null;
    let num : number | string;
    
    ind = this.editForm.getRawValue().id;
    num = ind !== null ? ind : "0";
    this.book.id = Number.parseInt(num);

    ind = this.editForm.getRawValue().title;
    this.book.title = ind !== null ? ind : "";

    ind = this.editForm.getRawValue().author;
    this.book.author = ind !== null ? ind : "";

    ind = this.editForm.getRawValue().cover;
    this.book.cover = ind !== null ? ind : "";

    ind = this.editForm.getRawValue().synopsis;
    this.book.synopsis = ind !== null ? ind : "";

    ind = this.editForm.getRawValue().price;
    num = ind !== null ? ind : "0";
    this.book.price = Number.parseInt(num);
  }
  
}
