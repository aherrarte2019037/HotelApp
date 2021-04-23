import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidatorService {

  constructor() { }

  passwordMatch( control1: string, control2: string ): ValidatorFn {
    return ( controls: AbstractControl ): ValidationErrors | null => {
      const password = controls.get(control1);
      const password2 = controls.get(control2);

      if( password?.value !== password2?.value && password2!.value.length > 0 ) {
        return { passwordDontMatch: true };

      } else {
        return null
      }

    }
  };


}

