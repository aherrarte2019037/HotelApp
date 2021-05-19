import { Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ReservationService } from '../services/reservation.service';

@Pipe({
  name: 'serviceQuantity'
})
export class ServiceQuantityPipe implements PipeTransform {

  constructor( private reservationService: ReservationService ) { }

  transform( value: any, service: any ): BehaviorSubject<number> {
    const quantity = new BehaviorSubject<number>(0);

    this.reservationService.getServicesByReservation( value.roomId, value.reservation._id ).subscribe( (data:any) => {
      data.forEach( (s: any) => s._id._id.toString() === service._id.toString()? quantity.next(s.quantity):null )
    })
    
    return quantity;
  }

}
