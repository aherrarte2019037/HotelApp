import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnotifyPosition, SnotifyService } from 'ng-snotify';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  editForm: FormGroup = this.buildForm();
  opened: boolean = false;
  checked: boolean = false;
  showIcon: boolean = false;
  activateEdit: boolean = false;
  formChanges: any = {};
  user: User;
  confirmDelete: boolean = false;
  user$ = new BehaviorSubject({});

  constructor(
    private authService: AuthService,
    private auth: AuthService,
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private snotifyService: SnotifyService
  )
  { }

  asignFormValues() {
    this.editForm.get('firstname').setValue(this.user.firstname);
    this.editForm.get('lastname').setValue(this.user.lastname);
    this.editForm.get('email').setValue(this.user.email);
    this.editForm.get('username').setValue(this.user.username);

    this.editForm.valueChanges.subscribe( data => {
      if( data.firstname === this.user.firstname && data.lastname === this.user.lastname && data.email === this.user.email && data.username === this.user.username ) {
        this.activateEdit = false;

      } else {
        this.activateEdit = true;
      }

      if( data.firstname !== this.user.firstname ) this.formChanges.firstname = data.firstname
      if( data.lastname !== this.user.lastname ) this.formChanges.lastname = data.lastname
      if( data.email !== this.user.email ) this.formChanges.email = data.email
      if( data.username !== this.user.username ) this.formChanges.username = data.username
    });
  }

  ngOnInit() {
    this.userService.getUserAuthenticated().subscribe( data => {
      this.user = data;
      this.user$.next( data )
      this.asignFormValues();
    });
  }

  buildForm() {
    return this.formBuilder.group({
      firstname: [ '', [Validators.required, Validators.minLength(2), Validators.maxLength(30)] ],
      lastname : [ '', [Validators.required, Validators.minLength(2), Validators.maxLength(30)] ],
      email    : [ '', [Validators.required, Validators.email] ],
      username : [ '', [Validators.required, Validators.minLength(5), Validators.maxLength(30)] ],
    });
  }

  toggleSidebar() {
    this.opened = !this.opened;
  }

  logOut() {
    this.auth.logOut();
    this.router.navigate(['login']);
  }

  getValidationError( input: string ) {
    const error = this.editForm.get(input)?.errors;
    const invalid = this.editForm.get(input)?.invalid;
   
    if( invalid && this.editForm.get(input)?.dirty || invalid && this.editForm.get(input)?.touched ) {
      if( 'required' in error! ) return 'Campo Requerido';
      if( 'minlength' in error! ) return `Mínimo ${error.minlength.requiredLength} caracteres`;
      if( 'maxlength' in error! ) return `Máximo ${error.maxlength.requiredLength}`;
      if( 'email' in error! ) return 'Correo Electrónico Inválido';
      if( 'pattern' in error! ) return 'Contraseña Inválida';
    }

    return null;
  }

  editProfile() {
    if( this.editForm.invalid ) {
      return this.editForm.markAllAsTouched()
    };

    this.showIcon = true;

    this.userService.editProfile( this.formChanges ).subscribe( 
      data => {
      this.snotifyService.success('Perfil editado', { showProgressBar: false, icon: '../../../assets/images/checkCircle.svg', iconClass: 'snotifyIcon', timeout: 1500, position: SnotifyPosition.rightTop })
      this.user = data['item']
      this.user$.next(data['item'])
      },
      error => console.log(error)
      );

    setTimeout(() => {
      this.showIcon = false;
      this.activateEdit = false;
    }, 500);
  }

  closeEditModal() {
    setTimeout(() => {
      this.editForm.get('firstname').setValue(this.user.firstname);
      this.editForm.get('lastname').setValue(this.user.lastname);
      this.editForm.get('email').setValue(this.user.email);
      this.editForm.get('username').setValue(this.user.username);
    }, 200);
  }

  deleteAccount() {
    this.userService.deleteAccount().subscribe( data => {
      this.snotifyService.success('Cuenta eliminada', { showProgressBar: false, icon: '../../../assets/images/checkCircle.svg', iconClass: 'snotifyIcon', timeout: 1500, position: SnotifyPosition.rightTop })
      this.authService.logOut();
      this.router.navigateByUrl('/login')
    });
  }

}
