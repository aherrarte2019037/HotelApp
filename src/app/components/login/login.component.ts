import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      email    : [ '', [Validators.required, Validators.email] ],
      password : [ '', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,30}$/) ]],
      remember : [ false ]
    }); 
  };

  getValidationError( input: string ) {
    const error = this.loginForm.get(input)?.errors;
    const invalid = this.loginForm.get(input)?.invalid;
   
    if( invalid && this.loginForm.get(input)?.dirty || invalid && this.loginForm.get(input)?.touched ) {
      if( 'required' in error! ) return 'Campo Requerido';
      if( 'minlength' in error! ) return `Mínimo ${error.minlength.requiredLength} caracteres`;
      if( 'maxlength' in error! ) return `Máximo ${error.maxlength.requiredLength}`;
      if( 'email' in error! ) return 'Correo Electrónico Inválido';
      if( 'pattern' in error! ) return 'Contraseña Inválida';
    }

    return null;
  }

  login() {
    if( this.loginForm.invalid ) {
      this.getSwal('Inicio De Sesión Fallido', 'Datos Inválidos', 'error')
      return this.loginForm.markAllAsTouched()
    };
    const { email, password, remember } = this.loginForm.value;
    this.authService.login( email, password, remember).subscribe(
      (data: any) => {
        if( data.logged ) this.getSwal( 'Inicio De Sesión Exitoso', `Bienvenido ${data.item.username}`, 'success', '/dashboard' );
        if( !data.logged ) this.getSwal( 'Inicio De Sesión Fallido', data.error, 'error' )},
        
      error => {
        if( error.error.error ) return this.getSwal( 'Registro Fallido', error.error.error, 'error' );
        this.getSwal( 'Registro Fallido', 'Something went wrong', 'error' );
      }
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
