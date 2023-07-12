import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { validateAllFormFields } from 'src/app/helpers/validateformvields';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash"
  registerForm!: FormGroup;

  constructor(private fb : FormBuilder,private auth:AuthService,private router:Router,private toast: NgToastService){}
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username : ['',Validators.required],
      email : ['',Validators.required],
      firstname : ['',Validators.required],
      lastname : ['',Validators.required],
      password : ['',Validators.required],
    })
  }
  
  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onRegister(){
    if(this.registerForm.valid){
        this.auth.register(this.registerForm.value).subscribe({
          next:(res) => {
            this.toast.success({detail:"Success",summary:res.message,duration:3000})
            this.registerForm.reset();
            this.router.navigate(['']);
          },
          error:(err) => {
            this.toast.error({detail:"Error",summary:err.error.message,duration:5000})
          }
        })
    } else {
      validateAllFormFields(this.registerForm);
    }
  }
}
