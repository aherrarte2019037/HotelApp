import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hotel } from '../models/hotel.model';
import { Service } from '../models/service.mode';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  apiUrl: string = this.globalService.getApiUrl();
  token: string = this.authService.getToken();

  constructor( private globalService: GlobalService, private http: HttpClient, private authService: AuthService ) { }

  getAll() {
    return this.http.get<Hotel[]>( `${this.apiUrl}/hotel/all` );
  }

  getOne( search: string ) {
    return this.http.get<Hotel>( `${this.apiUrl}/hotel/${search}` );
  }

  addLike( id: string ) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });

    return this.http.put( `${this.apiUrl}/hotel/${id}/like`, {}, { headers } );
  }

  addDislike( id: string ) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });

    return this.http.put( `${this.apiUrl}/hotel/${id}/dislike`, {}, { headers } );
  }

  addHotel( hotel: Hotel, adminUnassigned: string ) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });

    return this.http.post<Hotel>( `${this.apiUrl}/hotel`, { ...hotel, admin: adminUnassigned }, { headers } );
  }

  addService( service: Service, adminHotel: string ) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });

    return this.http.post<any>( `${this.apiUrl}/hotel/${adminHotel}/service`, { service }, { headers } );
  }

}
