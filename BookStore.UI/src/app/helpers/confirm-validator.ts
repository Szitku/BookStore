import { FormGroup } from "@angular/forms";


export function confirmPasswordValidator(controlName : string,matchcontrolName : string){
    return (formGroup:FormGroup) => {
        const passwordControl = formGroup.controls[controlName];
        const matchControl = formGroup.controls[matchcontrolName];
        if(matchControl.errors && matchControl.errors['confirmPasswordValidator']){
            return;
        }
        if(passwordControl.value !== matchControl.value){
            matchControl.setErrors({confirmPasswordValidator : true})
        }
    }
}