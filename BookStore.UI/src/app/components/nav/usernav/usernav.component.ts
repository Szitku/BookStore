import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-usernav',
  templateUrl: './usernav.component.html',
  styleUrls: ['./usernav.component.css']
})
export class UsernavComponent implements OnInit{
  public name : string = "";

  constructor(private auth : AuthService,private user : UserStoreService,private router : Router) {}
  
  ngOnInit(): void {
    this.user.getNameFromStore().subscribe(indname => {
      let name = this.auth.getNameFromToken();
      this.name = name || indname;
    })
  }
  
  isloggedin(): boolean{
    return this.auth.isLoggedIn();
  }

  logout(){
    return this.auth.logout();
  }

  isVisible() : boolean{
    return this.router.url.includes("login") || this.router.url.includes("orders") || this.router.url.includes("addbook") || this.router.url.includes("users") || this.router.url.includes("register") || this.router.url.includes("books");
  }


}
