import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Book } from '../models/bookmodel';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BooksService {

  ApiURL = environment.apiURL;

  constructor(private http: HttpClient) { }

  getBooks() : Observable<Book[]>{
    return this.http.get<Book[]>(`${this.ApiURL}/api/Book/getBooks`)
  }

  addBook(newBook : Book){
    return this.http.post<any>(`${this.ApiURL}/api/Book/addBook`, newBook);
  }

  getBookbyId(id : number) : Observable<Book>{
    return this.http.get<Book>(`${this.ApiURL}/api/Book/getBookbyId/${id}`);
  }

  updateBook(book : Book){
    return this.http.put<any>(`${this.ApiURL}/api/Book/updateBook`, book);
  }

  deleteBook(id : number){
    return this.http.delete<any>(`${this.ApiURL}/api/Book/deleteBook/${id}`);
  }
}
