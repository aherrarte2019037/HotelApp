import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { GlobalService } from './global.service';
import { tap } from 'rxjs/operators'

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

  login( email: string, password: string, remember: boolean ) {
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

  logOut() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.token = null;
  }

}