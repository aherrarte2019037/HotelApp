import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnotifyPosition, SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { Hotel } from 'src/app/models/hotel.model';
import { User } from 'src/app/models/user.model';
import { SearchFilterPipe } from 'src/app/pipes/search-filter.pipe';
import { HotelService } from 'src/app/services/hotel.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-hotel-page',
  templateUrl: './hotel-page.component.html',
  styleUrls: ['./hotel-page.component.css']
})
export class HotelPageComponent implements OnInit {
  searchTerm: string;
  hotels: Hotel[] = [];
  addHotelForm: FormGroup = this.buildAddHotelForm();
  addServiceForm: FormGroup = this.buildAddServiceForm();
  showAddModal: boolean = false;
  showAddServiceModal: boolean = false;
  hideDropdown: boolean = true;
  showDropdownError: boolean = false;
  activateAddHotel: boolean = false;
  activateAddService: boolean = false;
  showIcon: boolean = false;
  showIconService: boolean = false;
  hotelAdminUnassigned: User[];
  adminUnassigned: User;
  dropdownValue: string = '';
  userLogged: User;
  showEventDropdown: boolean = false;
  services: any = [];
  jelloAnimationLike: boolean = false;
  jelloAnimationDislike: boolean = false;

  constructor(
    private hotelService: HotelService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snotifyService: SnotifyService,
    private spinnerService: NgxSpinnerService,
    private searchFilter: SearchFilterPipe
  ) { }

  ngOnInit(): void {
    this.spinnerService.show( 'hotelSpinner' );
    this.addHotelForm.valueChanges.subscribe( () => this.addHotelForm.valid? this.activateAddHotel = true: this.activateAddHotel = false);
    this.addServiceForm.valueChanges.subscribe( () => this.addServiceForm.valid? this.activateAddService = true: this.activateAddService = false);
    this.userService.getUserAuthenticated().subscribe( data => this.userLogged = data );
    this.hotelService.getAll().subscribe( data => this.hotels = data );
    
    setTimeout(() => {
      this.spinnerService.hide( 'hotelSpinner' );
    }, 700);
  }

  //Hotel

  getHotelSearch() {
    return this.searchFilter.transform( this.hotels, this.searchTerm )
  }

  addLike( id: string ) {
    this.jelloAnimationLike = true;
    this.hotelService.addLike( id ).subscribe();
    setTimeout(() => {
      this.jelloAnimationLike = false;
    }, 500);
  }

  changeJelloAnimation( button: HTMLButtonElement ) {
    button.classList.add('jello-horizontal');
    
    setTimeout(() => {
      button.classList.remove('jello-horizontal');
    }, 500);
  }

  addDislike( id: string ) {
    this.jelloAnimationDislike = true;
    setTimeout(() => {
      this.jelloAnimationDislike = false;
    }, 500);
    this.hotelService.addDislike( id ).subscribe()
  }

  getValidationError( input: string, isServiceForm: boolean = false ) {
    if( isServiceForm ) {
      const error = this.addServiceForm.get(input)?.errors;
      const invalid = this.addServiceForm.get(input)?.invalid;
   
    if( invalid && this.addServiceForm.get(input)?.dirty || invalid && this.addServiceForm.get(input)?.touched ) {
      if( 'required' in error! ) return 'Campo Requerido';
      if( 'minlength' in error! ) return `Mínimo ${error.minlength.requiredLength} caracteres`;
      if( 'pattern' in error! ) return 'Solo números';
      if( 'min' in error! ) return `Número mínimo ${error.min.min}`;
      if( 'maxlength' in error! ) return `Máximo ${error.maxlength.requiredLength}`;
    }

    return null;

    } else {
      const error = this.addHotelForm.get(input)?.errors;
      const invalid = this.addHotelForm.get(input)?.invalid;
    
      if( invalid && this.addHotelForm.get(input)?.dirty || invalid && this.addHotelForm.get(input)?.touched ) {
        if( 'required' in error! ) return 'Campo Requerido';
        if( 'pattern' in error! ) return 'Solo números';
        if( 'minlength' in error! ) return `Mínimo ${error.minlength.requiredLength} caracteres`;
        if( 'min' in error! ) return `Número mínimo ${error.min.min}`;
        if( 'max' in error! ) return `Número máximo ${error.max.max}`;
        if( 'maxlength' in error! ) return `Máximo ${error.maxlength.requiredLength}`;
      }

      return null;

    }
  }

  addHotel() {
    if( this.addHotelForm.invalid ) {
      return this.addHotelForm.markAllAsTouched()
    };
    this.showIcon = true;

    this.hotelService.addHotel( this.addHotelForm.value, this.adminUnassigned._id ).subscribe( 
      (data:any) => {
        if( !data.added ) {
          this.snotifyService.error( data.error, { showProgressBar: false, icon: '../../../assets/images/closeCircle.svg', iconClass: 'snotifyIcon', timeout: 5000, position: SnotifyPosition.rightTop, pauseOnHover: true, closeOnClick: true, bodyMaxLength: 90 })
          this.activateAddHotel = true;
        }

        if( data.added ) {
          this.hotelService.getAll().subscribe( data => this.hotels = data );
          this.loadUsersUnassigned();
          this.activateAddHotel = false;
          this.addHotelForm.reset();
          this.dropdownValue = '';
          this.adminUnassigned = null;
          this.snotifyService.success('Hotel añadido', { showProgressBar: false, icon: '../../../assets/images/checkCircle.svg', iconClass: 'snotifyIcon', timeout: 2000, position: SnotifyPosition.rightTop })
        }
      },

      error => {
        this.snotifyService.error( 'Error al añadir hotel', { showProgressBar: false, icon: '../../../assets/images/closeCircle.svg', iconClass: 'snotifyIcon', timeout: 5000, position: SnotifyPosition.rightTop, pauseOnHover: true, closeOnClick: true, bodyMaxLength: 90 })
        this.activateAddHotel = true;
      }
      );

    setTimeout(() => {
      this.showIcon = false;
    }, 500);
  }

  loadUsersUnassigned() {
    this.userService.getAdminHotelUnassigned().subscribe( data => this.hotelAdminUnassigned = data );
  }

  setDropdownValue( user: User ) {
    this.adminUnassigned = user;
    this.dropdownValue = user.firstname.concat(' ', user.lastname);
    this.addHotelForm.get('adminName').setValue(this.dropdownValue);
    return this.showDropdownError = false;
  }

  resetAddHotelForm() {
    setTimeout(() => {
      this.addHotelForm.reset();
      this.dropdownValue = '';
    }, 100);
  }

  setDropdownError() {
    if( !this.dropdownValue ) return this.showDropdownError = true;
  }

  trackByHotelId( index: number, hotel: Hotel ) {
    return hotel._id;
  }

  buildAddHotelForm() {
    return this.formBuilder.group({
      name       : [ '', [Validators.required, Validators.minLength(2), Validators.maxLength(30)] ],
      stars      : [ '', [Validators.required, Validators.min(1), Validators.max(5), Validators.pattern(/^[0-9]$/)] ],
      description: [ '', Validators.required ],
      country    : [ '', Validators.required ],
      city       : [ '', Validators.required ],
      address    : [ '', Validators.required ],
      adminName  : [ '', Validators.required ],
    });
  }


  //Servicio

  buildAddServiceForm() {
    return this.formBuilder.group({
      name       : [ '', [Validators.required, Validators.minLength(2), Validators.maxLength(30)] ],
      description: [ '', Validators.required ],
      price      : [ '', [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]*$/)] ]
    });
  }

  addService() {
    if( this.addServiceForm.invalid ) {
      return this.addServiceForm.markAllAsTouched()
    };
    this.showIconService = true;

    this.hotelService.addService( this.addServiceForm.value, this.userLogged._id ).subscribe(
      (data: any) => {
        if( !data.added ) {
          this.snotifyService.error( data.error, { showProgressBar: false, icon: '../../../assets/images/closeCircle.svg', iconClass: 'snotifyIcon', timeout: 5000, position: SnotifyPosition.rightTop, pauseOnHover: true, closeOnClick: true, bodyMaxLength: 90 })
          this.activateAddService = true;
        }

        if( data.added ) {
          this.hotelService.getAll().subscribe( data => this.hotels = data );
          this.activateAddService = false;
          this.addServiceForm.reset();
          this.snotifyService.success('Servicio añadido', { showProgressBar: false, icon: '../../../assets/images/checkCircle.svg', iconClass: 'snotifyIcon', timeout: 2000, position: SnotifyPosition.rightTop })
        }
      },

      error => {
        this.snotifyService.error( 'Error al añadir servicio', { showProgressBar: false, icon: '../../../assets/images/closeCircle.svg', iconClass: 'snotifyIcon', timeout: 5000, position: SnotifyPosition.rightTop, pauseOnHover: true, closeOnClick: true, bodyMaxLength: 90 })
        this.activateAddService = true;
      }
    );

    setTimeout(() => {
      this.showIconService = false;
    }, 500);
  }

  resetAddServiceForm() {
    setTimeout(() => {
      this.addServiceForm.reset();
    }, 100);
  }


}
