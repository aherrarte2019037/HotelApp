import { Component, OnInit } from '@angular/core';
import { SnotifyPosition, SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { HotelService } from 'src/app/services/hotel.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reservations-page',
  templateUrl: './reservations-page.component.html',
  styleUrls: ['./reservations-page.component.css']
})
export class ReservationsPageComponent implements OnInit {
  reservations: any = [];
  showConfirmDeleteModal = false;
  deleteData: any = {};
  showServicesModal: boolean = false;
  showTotalPrice: boolean = false;
  servicesData: any = [];
  reservationSelected: any;
  showIcon: boolean = false;
  servicesByReservation = new BehaviorSubject<any>([]);
  totalPriceData: any;

  constructor(
    private spinnerService: NgxSpinnerService,
    private hotelService: HotelService,
    private reservationService: ReservationService,
    private userService: UserService,
    private snotifyService: SnotifyService
  )
  {}

  ngOnInit(): void {
    this.userService.getUserAuthenticated().subscribe( (data:any) => {
      if( data.role === 'client' ) this.reservationService.getReservationsByUser().subscribe(  data => this.reservations = data );
    });

    this.spinnerService.show( 'reservationSpinner' );
    

    setTimeout(() => {
      this.spinnerService.hide( 'reservationSpinner' )
    }, 1000);
  }

  trackByIndexReservation( index: number, reservation: any ) {
    return index;
  }

  editReservationStatus( room: string, reservation: string, cancelled: boolean ) {
    this.reservationService.editReservationStatus( cancelled, room, reservation).subscribe();
    this.reservationService.getReservationsByUser().subscribe(  data => this.reservations = data );
  }

  setDeleteData( room: string, reservation: string) {
    this.deleteData = { room, reservation }
  }

  deleteReservation() {
    this.reservationService.deleteReservation( this.deleteData.room, this.deleteData.reservation ).subscribe( data => this.showConfirmDeleteModal = false );
    this.reservationService.getReservationsByUser().subscribe(  data => this.reservations = data );
  }

  setServicesData( hotel: any ) {
    this.reservationSelected = hotel;
    this.reservationService.getServicesByReservation( hotel.roomId, hotel.reservation._id ).subscribe( (data:any) => this.servicesByReservation = data )
    this.hotelService.getOne( hotel.hotelId ).subscribe( (data:any) => this.servicesData = data.services );
  }

  setQuantityInputValue( input: any, service: string, add: boolean ) {
    if( Number(input.value) === 0 && !add ) return;

    if( add ) {
      input.value = Number(input.value) + 1;
      this.reservationService.addServiceToReservation( this.reservationSelected.reservation._id, service, input.value ).subscribe();
      return;

    } else {
      input.value = Number(input.value) - 1;
      this.reservationService.addServiceToReservation( this.reservationSelected.reservation._id, service, input.value ).subscribe();
      return;
    }
  }

  updateServices() {
    this.showIcon = true;

    setTimeout(() => {
      this.snotifyService.success('Datos guardados', { showProgressBar: false, icon: '../../../assets/images/checkCircle.svg', iconClass: 'snotifyIcon', timeout: 2000, position: SnotifyPosition.rightTop })
      this.showIcon = false
    }, 500);
  }

  setTotalPrice( reservation: any ) {
    this.reservationService.getTotalPrice( reservation.reservation._id ).subscribe( data => this.totalPriceData = data );
  }

}
