import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-adminnav',
  templateUrl: './adminnav.component.html',
  styleUrls: ['./adminnav.component.css']
})
export class AdminnavComponent {
  constructor(private router: Router,private auth : AuthService){}

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
