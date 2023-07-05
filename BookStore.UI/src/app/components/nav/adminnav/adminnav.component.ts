import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-adminnav',
  templateUrl: './adminnav.component.html',
  styleUrls: ['./adminnav.component.css']
})
export class AdminnavComponent implements OnInit {

  public name : string = "";

  constructor(private router: Router,private auth : AuthService,private userstore : UserStoreService){}

  ngOnInit(): void {
      this.userstore.getNameFromStore().subscribe(indname =>{
        let namefromtoken = this.auth.getNameFromToken();
        this.name = indname || namefromtoken;
      })
  }

  isLoginorRegisterPage() : Boolean {
    return this.router.url.includes('/login') || this.router.url.includes('/register') || this.router.url === '/';
  }

  logout(){
    this.auth.logout();
  }

  loggedin() : boolean{
    return this.auth.isLoggedIn();
  }
}
