import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators} from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private fb : FormBuilder,private auth:AuthService,private router:Router){}
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
            console.log(res)
            this.registerForm.reset();
            this.router.navigate(['']);
          },
          error:(err) => {
            console.log(err.error);
          }
        })
    } else {
      this.validateAllFormFields(this.registerForm);
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
}
