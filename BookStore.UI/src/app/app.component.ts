import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from './models/token-apimodel';
import { UserStoreService } from './services/user-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private auth : AuthService,private user : UserStoreService) {}

  ngOnInit(): void {
  }
  title = 'BookStore.UI';

}
