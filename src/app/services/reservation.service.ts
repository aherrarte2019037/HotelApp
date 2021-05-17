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

    return this.http.get( `${this.apiUrl}/hotel/reservation/user`, {  headers} );
  }

}
