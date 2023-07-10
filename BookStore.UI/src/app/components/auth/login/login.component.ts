import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash"
  loginForm!: FormGroup;
  resetPasswordEmail : string = "";
  isValidPasswordEmail : boolean = true;

  constructor(private fb:FormBuilder, private auth:AuthService,private router:Router,private toast: NgToastService,private userstore : UserStoreService){}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['',Validators.required],
      password: ['',Validators.required]
    })
  }
  
  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onLogin(){
    if(this.loginForm.valid){
      this.auth.login(this.loginForm.value).subscribe({
        next:(res) =>{
          this.auth.storeToken(res.accessToken);
          const tokenPayload = this.auth.decodeToken();

          this.auth.storeToken(res.accessToken);
          this.auth.storeRefreshToken(res.refreshToken);

          this.userstore.setNameFromStore(tokenPayload.unique_name);
          this.userstore.setRoleFromStore(tokenPayload.role);
          this.userstore.setIdFromStore(tokenPayload.nameid);

          this.toast.success({detail:"Success",summary:"Login success",duration:5000})
          this.loginForm.reset();
          this.router.navigate(['books']);
        },
        error:(err)=>{
          console.log(err);
          this.toast.error({detail:"Error",summary:err.error.message,duration:5000})
          console.log(err.error);
        }
      })
    } else {
      this.validateAllFormFields(this.loginForm);

    }
  }

  private validateAllFormFields(formGroup:FormGroup){
      Object.keys(formGroup.controls).forEach(field=>{
        const control = formGroup.get(field);
        if(control instanceof FormControl){
          control.markAsDirty({onlySelf:true});
        }else if(control instanceof FormGroup){
          this.validateAllFormFields(control)
        }
      })
  }

  checkValidEmail(event : string){
      const value = event;
      const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      this.isValidPasswordEmail = pattern.test(value);
      return this.isValidPasswordEmail;
  }
  clickToSendReset(){
    if(this.checkValidEmail(this.resetPasswordEmail)){
      
    }
  }
}
