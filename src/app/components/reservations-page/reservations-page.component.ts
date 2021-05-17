import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Reservation } from 'src/app/models/reservation.model';
import { User } from 'src/app/models/user.model';
import { ReservationService } from 'src/app/services/reservation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reservations-page',
  templateUrl: './reservations-page.component.html',
  styleUrls: ['./reservations-page.component.css']
})
export class ReservationsPageComponent implements OnInit {
  showContent: boolean = false;
  reservations: any = [];

  constructor(
    private spinnerService: NgxSpinnerService,
    private userService: UserService,
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

}
