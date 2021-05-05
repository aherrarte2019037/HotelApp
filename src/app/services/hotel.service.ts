import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hotel } from '../models/hotel.model';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  apiUrl: string = this.globalService.getApiUrl();

  constructor( private globalService: GlobalService, private http: HttpClient ) { }

  getAll() {
    return this.http.get<Hotel[]>( `${this.apiUrl}/hotel/all` );
  }

}
