import { Component, OnInit } from '@angular/core';
import { SnotifyPosition, SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { User, UserRoles } from 'src/app/models/user.model';
import { ReservationService } from 'src/app/services/reservation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-bills-page',
  templateUrl: './bills-page.component.html',
  styleUrls: ['./bills-page.component.css']
})
export class BillsPageComponent implements OnInit {
  reservations: any = [];
  showBillModal: boolean = false;
  billData: any;
  userLogged: User;

  constructor(
    private spinnerService: NgxSpinnerService,
    private snotifyService: SnotifyService,
    private reservationService: ReservationService,
    private userService: UserService
  )
  {}

  ngOnInit() {
    this.spinnerService.show( 'billSpinner' );
    this.userService.getUserAuthenticated().subscribe( data =>{
      this.userLogged = data;
      if( this.userLogged.role === UserRoles.hotel_admin ) this.reservationService.getReservationsByHotel().subscribe( data => this.reservations = data );
      if( this.userLogged.role === UserRoles.client ) this.reservationService.getReservationsByUser().subscribe( data => this.reservations = data )
    });

    setTimeout(() => {
      this.spinnerService.hide( 'billSpinner' )
    }, 1000);
  }

  trackByIndex( index: number, item: any ) {
    return index;
  }

  addBill( reservation: any, iconHtml: SVGAElement, textButton: HTMLSpanElement ) {
    iconHtml.classList.replace( 'hidden', 'block' );
    textButton.classList.replace( 'block', 'hidden' );

    this.reservationService.addBill( reservation.user._id, reservation._id ).subscribe( 
      data => {
      if( data['added'] ){
        this.snotifyService.success('Factura realizada', { showProgressBar: false, icon: '../../../assets/images/checkCircle.svg', iconClass: 'snotifyIcon', timeout: 2000, position: SnotifyPosition.rightTop });
        this.reservationService.getReservationsByHotel().subscribe( data => this.reservations = data );
      } 
      if( !data['added'] ) this.snotifyService.success( data['error'], { showProgressBar: false, icon: '../../../assets/images/checkCircle.svg', iconClass: 'snotifyIcon', timeout: 2000, position: SnotifyPosition.rightTop })
      },
      error => this.snotifyService.error( error.error? error.error: 'Error al crear factura', { showProgressBar: false, icon: '../../../assets/images/closeCircle.svg', iconClass: 'snotifyIcon', timeout: 5000, position: SnotifyPosition.rightTop, pauseOnHover: true, closeOnClick: true, bodyMaxLength: 90 }),
    );

    setTimeout(() => {
      iconHtml.classList.replace( 'block', 'hidden' )
      textButton.classList.replace( 'hidden', 'block' );
    }, 500);
  }

  getBill ( bill: string ) {
    this.reservationService.getBillById( bill ).subscribe( data => {
      this.showBillModal = true;
      this.billData = data;
    });
  }

}
