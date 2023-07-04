import { Component, OnInit } from '@angular/core';
import { user } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit{
  users : user[] = [];

  constructor(private userService : UsersService){}
  ngOnInit(): void {
      this.userService.getUsers().subscribe({
        next : (res) => {
          this.users = res;
        },
        error : (err) => {
          console.log(err);
        }
      })
  }
}
