import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReservationService } from 'src/app/services/reservation.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-reservations-page',
  templateUrl: './reservations-page.component.html',
  styleUrls: ['./reservations-page.component.css']
})
export class ReservationsPageComponent implements OnInit {
  showContent: boolean = false;
  reservations: any = [];
  showConfirmDeleteModal = false;
  deleteData: any = {};

  constructor(
    private spinnerService: NgxSpinnerService,
    private reservationService: ReservationService
  )
  {}

  ngOnInit(): void {
    this.spinnerService.show( 'reservationSpinner' );
    this.reservationService.getReservationsByUser().subscribe(  data => this.reservations = data );

    setTimeout(() => {
      this.showContent = true;
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

}
