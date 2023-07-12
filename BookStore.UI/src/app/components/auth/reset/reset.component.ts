import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { confirmPasswordValidator } from 'src/app/helpers/confirm-validator';
import { validateAllFormFields } from 'src/app/helpers/validateformvields';
import { resetpasswordmodel } from 'src/app/models/resetpasswordmodel';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  
  newpasswordForm !: FormGroup;
  emailToReset !: string;
  emailToken !: string;
  resetPasswordObj = new resetpasswordmodel();

  constructor(private fb : FormBuilder,private activatedRoute : ActivatedRoute,private resetService : ResetPasswordService,private toast : NgToastService,private router : Router) {}
  
  ngOnInit(): void {
    this.newpasswordForm = this.fb.group({
      password: [null,Validators.required],
      confirmPassword: [null,Validators.required],
    }, {
      validator : confirmPasswordValidator("password","confirmPassword")
    })

    this.activatedRoute.queryParams.subscribe(val => {
      this.emailToReset = val['email'];
      let urlToken = val['code'];
      this.emailToken = urlToken.replace(/ /g,'+');
    })
  }

  onNewPassword(){
    if(this.newpasswordForm.valid){
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.emailtoken = this.emailToken;
      this.resetPasswordObj.newPassword = this.newpasswordForm.value.password;
      this.resetPasswordObj.confirmPassword = this.newpasswordForm.value.confirmPassword;

      this.resetService.resetPassword(this.resetPasswordObj).subscribe({
        next:(res) =>{
          this.toast.success({detail: 'Success',summary: res.message,duration: 3000,});
          this.router.navigate(['/login']);
        }, error:(err) => {
            if(err.status === 400 || err.status === 404){
              this.toast.error({detail: 'Error',summary: err.error.message,duration: 5000,});
              this.router.navigate(['/login']);
            }
        }
      })

    }else {
      validateAllFormFields(this.newpasswordForm);

      
    }
  }

}
