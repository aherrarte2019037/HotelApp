import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  apiUrl: string = this.globalService.getApiUrl();
  token: string = this.authService.getToken();

  constructor( private globalService: GlobalService, private authService: AuthService, private http: HttpClient ) { }

  getReservationsByUser() {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });

    return this.http.get( `${this.apiUrl}/hotel/reservation/user`, { headers } );
  }

  editReservationStatus( cancelled: boolean, room: string, reservation: string ) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });

    return this.http.put( `${this.apiUrl}/hotel/room/${room}/reservation/${reservation}/status`, { cancelled }, {  headers} );
  }

  deleteReservation( room: string, reservation: string ) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });

    return this.http.delete( `${this.apiUrl}/hotel/room/${room}/reservation/${reservation}`, { headers } );
  }

  addServiceToReservation( reservation: string, service: string, quantity: string ) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });

    return this.http.post( `${this.apiUrl}/hotel/reservation/${reservation}/service`, { service, quantity }, { headers } );
  }

  getServicesByReservation( room: string, reservation: string ) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });

    return this.http.get( `${this.apiUrl}/user/room/${room}/service/reservation/${reservation}`, { headers } )
  }

}
