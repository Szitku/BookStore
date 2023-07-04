import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksListComponent } from './components/books/books-list/books-list.component';
import { AddBookComponent } from './components/books/add-book/add-book.component';
import { EditBookComponent } from './components/books/edit-book/edit-book.component';
import { LoginComponent } from './components/auth/login/login.component';
import { OrdersComponent } from './components/books/orders-list/orders/orders.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
     path: '', 
     component: LoginComponent,
  },
  {
    path: 'login',
    component:LoginComponent
  },
  {
    path: 'register',
    component:RegisterComponent
  },
  {
    path: 'books',
    component:BooksListComponent,
    canActivate:[authGuard]
  },
  {
    path: 'addbook',
    component:AddBookComponent,
    canActivate:[authGuard]
  },
  {
    path: 'books/editbook/:id',
    component:EditBookComponent,
    canActivate:[authGuard]
  },
  {
    path: 'orders',
    component:OrdersComponent,
    canActivate:[authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
