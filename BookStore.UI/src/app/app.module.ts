import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BooksListComponent } from './components/books/books-list/books-list.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AddBookComponent } from './components/books/add-book/add-book.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditBookComponent } from './components/books/edit-book/edit-book.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { OrdersComponent } from './components/books/orders-list/orders/orders.component';
import { UsernavComponent } from './components/nav/usernav/usernav.component';
import { AdminnavComponent } from './components/nav/adminnav/adminnav.component';
import { NgToastModule } from 'ng-angular-popup';
import { UsersListComponent } from './components/users/users-list/users-list.component';
import { Tokeninterceptor } from './interceptors/token.interceptor';
import { ResetComponent } from './components/auth/reset/reset.component';
import { FrontpageComponent } from './components/store/frontpage/frontpage.component';
import { ViewbookComponent } from './components/store/viewbook/viewbook.component';
import { CartComponent } from './components/store/cart/cart.component';


@NgModule({
  declarations: [
    AppComponent,
    BooksListComponent,
    AddBookComponent,
    EditBookComponent,
    LoginComponent,
    RegisterComponent,
    OrdersComponent,
    UsernavComponent,
    AdminnavComponent,
    UsersListComponent,
    ResetComponent,
    FrontpageComponent,
    ViewbookComponent,
    CartComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgToastModule
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:Tokeninterceptor,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
