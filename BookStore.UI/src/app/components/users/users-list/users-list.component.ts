import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { user } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit{
  users : user[] = [];

  constructor(private userService : UsersService,private toast : NgToastService){}
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

  onClickDelete(userid : number){
    this.userService.deleteUser(userid).subscribe({
      next : (res) => {
        this.users = this.users.filter(x => x.id !== userid);
        console.log(this.users);
        this.toast.success({detail:"Success",summary:"User deleted!",duration:3000});
        console.log(res);
      },
      error : (err) => {
        console.log(err)
      }
    })
  }



}
