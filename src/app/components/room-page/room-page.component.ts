import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnotifyPosition, SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { Hotel } from 'src/app/models/hotel.model';
import { Room } from 'src/app/models/room.model';
import { User } from 'src/app/models/user.model';
import { SearchFilterPipe } from 'src/app/pipes/search-filter.pipe';
import { HotelService } from 'src/app/services/hotel.service';
import { RoomService } from 'src/app/services/room.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.css']
})
export class RoomPageComponent implements OnInit {
  searchTerm: string;
  rooms: any[] = [];
  hotels: any = [];
  userLogged: User;
  showAddModal: boolean = false;
  showReserveModal: boolean = false;
  showServicesModal: boolean = false;
  addRoomForm: FormGroup = this.buildAddRoomForm();
  reserveRoomForm: FormGroup = this.buildReserveRoomForm();
  activateAddRoom: boolean = false;
  activateAddReserve: boolean = false;
  showIcon: boolean = false;
  showIconReserve: boolean = false;
  hideDropdown: boolean = true;
  showDropdownError: boolean = false;
  dropdownValue: string = '';
  hotelSelected: string;
  reserveDataSelected: any;
  minDate: Date = new Date();
  exitMinDate: Date = new Date();
  servicesData: any = [];

  constructor(
    private spinnerService: NgxSpinnerService,
    private userService: UserService,
    private roomService: RoomService,
    private formBuilder: FormBuilder,
    private hotelService: HotelService,
    private snotifyService: SnotifyService,
    private searchFilter: SearchFilterPipe
  ) { }

  ngOnInit(): void {
    this.userService.getUserAuthenticated().subscribe( data => this.userLogged = data );
    this.spinnerService.show( 'roomSpinner' );
    this.roomService.getAll().subscribe( data => this.rooms = data );
    this.addRoomForm.valueChanges.subscribe( () => this.addRoomForm.valid? this.activateAddRoom = true: this.activateAddRoom = false);
    this.reserveRoomForm.valueChanges.subscribe( () => {
      this.exitMinDate = this.reserveRoomForm.get('entryDateTime').value;
     if( 
        this.reserveRoomForm.get('exitDateTime').value &&
        this.reserveRoomForm.get('entryDateTime').value &&
        this.reserveRoomForm.get('hotel').value &&
        this.reserveRoomForm.get('room').value ) {
          this.activateAddReserve = true;
        } else { this.activateAddReserve = false }
    });
    this.hotelService.getAll().subscribe( data => this.hotels = data.map( h => { return {_id: h._id, name: h.name} } ) );

    setTimeout(() => {
      this.spinnerService.hide( 'roomSpinner' )
    }, 1000);
  
  }

  //Room
  trackByRoomsId( index: number, room: Room ) {
    return index;
  }

  resetAddRoomForm() {
    this.addRoomForm.reset();
    this.dropdownValue = '';
  }

  buildAddRoomForm() {
    return this.formBuilder.group({
      name        : [ '', [Validators.required, Validators.maxLength(30)] ],
      pricePerHour: [ '', [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]*$/)] ],
      hotel       : [ '', [Validators.required] ]
    });
  }

  addRoom() {
    this.showIcon = true;

    this.roomService.addRoom( this.addRoomForm.value.hotel, this.addRoomForm.value ).subscribe(
      (data: any) => {
        if( !data.added ) {
          this.snotifyService.error( data.error, { showProgressBar: false, icon: '../../../assets/images/closeCircle.svg', iconClass: 'snotifyIcon', timeout: 5000, position: SnotifyPosition.rightTop, pauseOnHover: true, closeOnClick: true, bodyMaxLength: 90 })
          this.activateAddRoom = true;
        }

        if( data.added ) {
          this.dropdownValue = '';
          this.hotelSelected = '';
          this.roomService.getAll().subscribe( data => this.rooms = data );
          this.activateAddRoom = false;
          this.addRoomForm.reset();
          this.snotifyService.success('Hotel añadido', { showProgressBar: false, icon: '../../../assets/images/checkCircle.svg', iconClass: 'snotifyIcon', timeout: 2000, position: SnotifyPosition.rightTop })
        }
      },

      error => {
        this.snotifyService.error( 'Error al añadir hotel', { showProgressBar: false, icon: '../../../assets/images/closeCircle.svg', iconClass: 'snotifyIcon', timeout: 5000, position: SnotifyPosition.rightTop, pauseOnHover: true, closeOnClick: true, bodyMaxLength: 90 })
        this.activateAddRoom = true;
      }
    );

    setTimeout(() => {
      this.showIcon = false;
    }, 500);
  }

  setDropdownError() {
    if( !this.dropdownValue ) return this.showDropdownError = true;
  }

  setDropdownValue( hotel: any ) {
    this.hotelSelected = hotel._id;
    this.dropdownValue = hotel.name;
    this.addRoomForm.get('hotel').setValue(hotel._id);
    return this.showDropdownError = false;
  }


  //Reserve
  resetReserveRoomForm() {
    this.reserveRoomForm.reset();
  }

  buildReserveRoomForm() {
    const form = this.formBuilder.group({
      entryDateTime: [ '', Validators.required],
      exitDateTime : [ '', Validators.required],
      hotel        : [ '', Validators.required ],
      room         : [ '', Validators.required ],
    });

    form.get( 'entryDateTime' ).disable();
    form.get( 'exitDateTime' ).disable();

    return form;
  }

  addReservation() {
    if( this.reserveRoomForm.invalid ) {
      return this.reserveRoomForm.markAllAsTouched()
    };
    this.showIconReserve = true;

    const entryDateTime = this.reserveRoomForm.get('entryDateTime').value;
    const exitDateTime = this.reserveRoomForm.get('exitDateTime').value;
    const { hotel, room } = this.reserveRoomForm.value

    this.roomService.addReservation( entryDateTime, exitDateTime, hotel, room ).subscribe(
      (data: any) => {
        if( !data.added ) {
          this.snotifyService.error( data.error, { showProgressBar: false, icon: '../../../assets/images/closeCircle.svg', iconClass: 'snotifyIcon', timeout: 5000, position: SnotifyPosition.rightTop, pauseOnHover: true, closeOnClick: true, bodyMaxLength: 90 })
          this.activateAddReserve = true;
        }
        
        if( data.added ) {
          this.reserveRoomForm.get( 'exitDateTime' ).reset();
          this.reserveRoomForm.get( 'entryDateTime' ).reset();
          this.snotifyService.success('Reservación exitosa', { showProgressBar: false, icon: '../../../assets/images/checkCircle.svg', iconClass: 'snotifyIcon', timeout: 2000, position: SnotifyPosition.rightTop })
          this.activateAddReserve = false;
        }
      },

      error => {
        this.snotifyService.error( 'Reservación Fallida', { showProgressBar: false, icon: '../../../assets/images/closeCircle.svg', iconClass: 'snotifyIcon', timeout: 5000, position: SnotifyPosition.rightTop, pauseOnHover: true, closeOnClick: true, bodyMaxLength: 90 })
        this.activateAddReserve = false;
      }
    );

    setTimeout(() => {
      this.showIconReserve = false;
    }, 500);
  }

  setReserveDataSelected( data: any ) {
    this.reserveRoomForm.get('hotel').setValue( data.hotel._id );
    this.reserveRoomForm.get('room').setValue( data.room._id );
  }


  //General
  getValidationError( input: string, form: string = 'addRoom' ) {
    if( form === 'addRoom' ) {
      const error = this.addRoomForm.get(input)?.errors;
      const invalid = this.addRoomForm.get(input)?.invalid;
     
      if( invalid && this.addRoomForm.get(input)?.dirty || invalid && this.addRoomForm.get(input)?.touched ) {
        if( 'required' in error! ) return 'Campo Requerido';
        if( 'pattern' in error! ) return 'Solo números y sin decimales';
        if( 'min' in error! ) return `Número mínimo ${error.min.min}`;
      }
      return null;

    } else {
      const error = this.reserveRoomForm.get(input)?.errors;
      const invalid = this.reserveRoomForm.get(input)?.invalid;
     
      if( invalid && this.reserveRoomForm.get(input)?.dirty || invalid && this.reserveRoomForm.get(input)?.touched ) {
        if( 'required' in error! ) return 'Campo Requerido';
        if( 'pattern' in error! ) return 'Solo números y sin decimales';
        if( 'min' in error! ) return `Número mínimo ${error.min.min}`;
      }
  
      return null;
    }
    
  }

  getRoomsSearch() {
    return this.searchFilter.transform( this.rooms, this.searchTerm )
  }

  setServicesData( hotel: string ) {
    this.hotelService.getOne( hotel ).subscribe( (data:any) => this.servicesData = data.services );
  }

  dateFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0 && day !== 6;
  }

}
