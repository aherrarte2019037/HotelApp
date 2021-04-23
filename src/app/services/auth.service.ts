import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string;

  constructor( private globalService : GlobalService, private htpp: HttpClient ) {
    this.apiUrl = this.globalService.getApiUrl();
  }

  register( user: User ) {
    return this.htpp.post( `${this.apiUrl}/user/register`, user );
  }

  login( email: string, password: string ) {
    return this.htpp.post(`${this.apiUrl}/user/login`, { email, password })
  }

}
