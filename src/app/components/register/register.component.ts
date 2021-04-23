import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidatorService } from 'src/app/services/form-validator.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private formValidator: FormValidatorService 
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.registerForm = this.formBuilder.group({
      username : [ '', [Validators.required, Validators.minLength(5), Validators.maxLength(30)] ],
      firstname: [ '', [Validators.required, Validators.minLength(2), Validators.maxLength(30)] ],
      lastname : [ '', [Validators.required, Validators.minLength(2), Validators.maxLength(30)] ],
      email    : [ '', [Validators.required, Validators.email] ],
      password : [ '', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,30}$/) ]],
      password2: [ '', [Validators.required] ]
    },
    {
      validators: this.formValidator.passwordMatch('password', 'password2')
    }); 
  };

  getValidationError( input: string ) {
    const error = this.registerForm.get(input)?.errors;
    const invalid = this.registerForm.get(input)?.invalid;
   
    if( this.registerForm.hasError('passwordDontMatch') && input === 'password2' ) return 'Contraseñas No Coinciden'

    if( invalid && this.registerForm.get(input)?.dirty || invalid && this.registerForm.get(input)?.touched ) {
      if( 'required' in error! ) return 'Campo Requerido';
      if( 'minlength' in error! ) return `Mínimo ${error.minlength.requiredLength} caracteres`;
      if( 'maxlength' in error! ) return `Máximo ${error.maxlength.requiredLength}`;
      if( 'email' in error! ) return 'Correo Electrónico Inválido';
      if( 'pattern' in error! ) return 'Contraseña Inválida';
    }

    return null;
  }

  register() {
    if( this.registerForm.invalid ) {
      this.getSwal('Registro Fallido', 'Datos Inválidos', 'error')
      return this.registerForm.markAllAsTouched()
    };
    const user: User = this.registerForm.value;
    this.authService.register( user ).subscribe(
      (data: any) => {
        if( data.registered ) this.getSwal( 'Registro Exitoso', `Bienvenido ${data.user.username}`, 'success', '/login' );
        if( !data.registered ) this.getSwal( 'Registro Fallido', data.error, 'error' )},

      error => this.getSwal( 'Registro Fallido', 'Something went wrong', 'error' )
    );
  }

  getSwal( title: string, text: string, type: any, navigate?: string ) {
    const SwalAlert = Swal.mixin({
      customClass: {
        confirmButton: 'btn-swal-success',
        cancelButton: 'btn-swal-danger'
      },
      buttonsStyling: false
    });
    
    SwalAlert.fire({
      title: title,
      text: text,
      icon: type,
      width: 400
    }).then( result => {
      if( navigate && result.isConfirmed ) this.router.navigate([navigate]);
    });
  }

}
