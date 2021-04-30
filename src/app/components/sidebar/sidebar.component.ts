import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
  user   : User;
  user$ = new BehaviorSubject({});

  constructor(
    private auth: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.userService.getUserAuthenticated().subscribe( data => {
      this.user = data;
      this.user$.next( data )
      this.asignFormValues();
    });
  }

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
    this.spinner.show();
    setTimeout(() => this.spinner.hide(), 1000);
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

  editProfile() {
    if( this.editForm.invalid ) {
      return this.editForm.markAllAsTouched()
    };

    this.showIcon = true;

    this.userService.editProfile( this.formChanges ).subscribe( data => {
      this.user = data['item']
      this.user$.next(data['item'])
    });

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

}
