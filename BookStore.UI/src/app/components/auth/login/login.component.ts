import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { validateAllFormFields } from 'src/app/helpers/validateformvields';
import { AuthService } from 'src/app/services/auth.service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
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

  constructor(private fb:FormBuilder, private auth:AuthService,private router:Router,private toast: NgToastService,private userstore : UserStoreService,private resetservice : ResetPasswordService){}
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
          
          console.log(tokenPayload);
         

          this.toast.success({detail:"Success",summary:"Login success",duration:5000})
          this.loginForm.reset();
          this.router.navigate(['books']);
        },
        error:(err)=>{
          this.toast.error({detail:"Error",summary:err.error.message,duration:5000})
        }
      })
    } else {
      validateAllFormFields(this.loginForm);
    }
  }


  checkValidEmail(event : string){
      const value = event;
      const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      this.isValidPasswordEmail = pattern.test(value);
      return this.isValidPasswordEmail;
  }
  clickToSendReset(){
    if(this.checkValidEmail(this.resetPasswordEmail)){
      console.log(this.resetPasswordEmail);
      
      this.resetservice.sendResetPasswordLink(this.resetPasswordEmail).subscribe({
        next:(res) => {
          // Clearing the modul and closing
          this.resetPasswordEmail = "";
          this.isValidPasswordEmail = true;
          const buttonRef = document.getElementById("closeBtn");
          buttonRef?.click();
          this.toast.success({detail:"Success",summary:"Password reset has been sent!"});
          

        },
        error:(err) => {
          this.toast.error({detail:"Error",summary:err.error.message,duration:5000})
        }
      });


      

    } else if(this.isValidPasswordEmail === false){
      this.toast.error({detail:"Error",summary:"This is not a correct email check the warning under the email field",duration:5000})
    }
  }
}
