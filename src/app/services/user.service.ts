import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import jwt from 'jwt-decode';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl: string = this.globalService.getApiUrl();
  token: string = this.auth.getToken();

  constructor( private globalService : GlobalService, private http: HttpClient, private auth: AuthService ) { }

  getUserAuthenticated() {
    this.token = localStorage.getItem( 'token' )? localStorage.getItem( 'token' ):sessionStorage.getItem( 'token' );
    const id = jwt(this.token)['sub'];
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });

    return this.http.get<User>( `${this.apiUrl}/user/${id}`, { headers } );
  }

  editProfile( update: any ) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });

    return this.http.put<User>( `${this.apiUrl}/user`, { update }, { headers } )
  }

  getAdminHotelUnassigned() {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });

    return this.http.get<User[]>( `${this.apiUrl}/user/admin/unassigned`, { headers } );
  }

}
