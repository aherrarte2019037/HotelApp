import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserRoles } from '../models/user.model';
import { GlobalService } from './global.service';
import { tap } from 'rxjs/operators'
import decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string;
  token: string = this.getToken();

  constructor( private globalService : GlobalService, private htpp: HttpClient ) {
    this.apiUrl = this.globalService.getApiUrl();
  }

  register( user: User ) {
    return this.htpp.post( `${this.apiUrl}/user/register`, user );
  }

  registerAdminHotel( user: User, adminAppToken: string ) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${adminAppToken}` });

    user.role = UserRoles.hotel_admin;
    return this.htpp.post( `${this.apiUrl}/user/register`, user, { headers } );
  }

  login( email: string, password: string, remember: boolean, confirmCredentials = false ) {
    if( confirmCredentials ) return this.htpp.post(`${this.apiUrl}/user/login`, { email, password });

    return this.htpp.post(`${this.apiUrl}/user/login`, { email, password }).pipe(
      tap( data => this.setToken( data['jwt'], remember ) )
    )
  }

  setToken( token: string, remember: boolean ) {
    if( token ) {

      this.token = token;
      if( !remember ) sessionStorage.setItem( 'token', token );
      if( remember ) localStorage.setItem( 'token', token );

    } 
  }

  getToken() {    
    return localStorage.getItem( 'token' )? localStorage.getItem( 'token' ):sessionStorage.getItem( 'token' );
  }

  isAuthenticated() {
    return this.token? true : false;
  }

  getRoleAuthenticated(): UserRoles {
    return decode( this.token )['role'];
  }

  logOut() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.token = null;
  }

}
