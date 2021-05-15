import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hotel } from '../models/hotel.model';
import { Room } from '../models/room.model';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  apiUrl: string = this.globalService.getApiUrl();
  token: string = this.authService.getToken();

  constructor( private globalService: GlobalService, private authService: AuthService, private http: HttpClient ) { }

  getAll() {
    return this.http.get<Room[]>( `${this.apiUrl}/hotel/room/all` );
  }

  addRoom( hotel: string, room: Room | Room[]  ) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });

    return this.http.post<any>( `${this.apiUrl}/hotel/room`, { hotel, room }, { headers } );
  }

  addReservation( entryDateTime: any, exitDateTime: any, hotel: string, room: string ) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    
    return this.http.post( `${this.apiUrl}/hotel/${hotel}/room/${room}/reservation`, { entryDateTime, exitDateTime }, { headers } )
  }

}
