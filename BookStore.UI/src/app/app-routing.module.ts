import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksListComponent } from './components/books/books-list/books-list.component';
import { AddBookComponent } from './components/books/add-book/add-book.component';
import { EditBookComponent } from './components/books/edit-book/edit-book.component';
import { LoginComponent } from './components/auth/login/login.component';
import { OrdersComponent } from './components/books/orders-list/orders/orders.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { authGuard } from './guards/auth.guard';
import { UsersListComponent } from './components/users/users-list/users-list.component';
import { ResetComponent } from './components/auth/reset/reset.component';
import { FrontpageComponent } from './components/store/frontpage/frontpage.component';
import { loggedinguardGuard } from './guards/loggedinguard.guard';
import { ViewbookComponent } from './components/store/viewbook/viewbook.component';
import { CartComponent } from './components/store/cart/cart.component';

const routes: Routes = [
  {
     path: '', 
     component: FrontpageComponent
  },
  {
    path: "viewbook/:id",
    component:ViewbookComponent
  },
  {
    path: 'login',
    component:LoginComponent,
    canActivate:[loggedinguardGuard]
  },
  {
    path: 'register',
    component:RegisterComponent,
    canActivate:[loggedinguardGuard]
  },
  {
    path: 'reset',
    component:ResetComponent,
    canActivate:[loggedinguardGuard]
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
  },
  {
    path: 'users',
    component:UsersListComponent,
    canActivate:[authGuard]
  },
  {
    path: 'cart',
    component:CartComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
