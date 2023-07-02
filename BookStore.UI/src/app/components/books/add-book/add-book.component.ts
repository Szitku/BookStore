import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Book } from 'src/app/models/bookmodel';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent {
  
  newBook: Book = {
    id: 0,
    title: '',
    author: '',
    cover: '',
    synopsis: '',
    price: 0
  }

  addForm = new FormGroup({
    title: new FormControl('',Validators.required),
    author: new FormControl('',Validators.required),
    cover: new FormControl('',Validators.required),
    synopsis: new FormControl('',Validators.required),
    price: new FormControl('',[
      Validators.min(1),Validators.required
    ]),
  })

  constructor(private bookService : BooksService, private router : Router, private toast : NgToastService){}
 

 addBook(){
  if(this.addForm.valid){
    this.formToBook();
    this.bookService.addBook(this.newBook)
    .subscribe({
      next : (res) => {
        this.toast.success({detail:"Success",summary:res.message,duration:3000});
        this.router.navigate(['books']);
      },
      error : (err) => {
        this.toast.error({detail:"Error",summary:err.error.message,duration:5000});
      }
    })} else {
    this.validateAllFormFields(this.addForm);
  }
    
 }

 private formToBook(){
  // biztos van jobb megoldas
  let ind : string | null;
  let num : number | string;

  ind = this.addForm.getRawValue().title;
  this.newBook.title = ind !== null ? ind : "";

  ind = this.addForm.getRawValue().author;
  this.newBook.author = ind !== null ? ind : "";

  ind = this.addForm.getRawValue().cover;
  this.newBook.cover = ind !== null ? ind : "";

  ind = this.addForm.getRawValue().synopsis;
  this.newBook.synopsis = ind !== null ? ind : "";

  ind = this.addForm.getRawValue().price;
  num = ind !== null ? ind : "0";
  this.newBook.price = Number.parseInt(num);
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

 

 
}
