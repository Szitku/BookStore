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
  public role : string = "";

  constructor(private auth : AuthService,private userstore : UserStoreService){}

  ngOnInit(): void {
      this.userstore.getNameFromStore().subscribe(indname =>{
        let namefromtoken = this.auth.getNameFromToken();
        this.name = indname || namefromtoken;
      })
      this.userstore.getRoleFromStore().subscribe(indrole => {
        let rolefromtoken = this.auth.getRoleFromToken();
        this.role = indrole || rolefromtoken;
      });
  }

  isRoleAdmin() : Boolean {
    return this.role === "Admin";
  }

  logout(){
    this.auth.logout();
  }

  loggedin() : boolean{
    return this.auth.isLoggedIn();
  }
}
