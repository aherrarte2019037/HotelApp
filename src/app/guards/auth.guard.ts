import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private router: Router, private auth: AuthService ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean  {

      const isAuthenticated = this.auth.isAuthenticated();
      
      switch( state.url ) {
        case '/dashboard/hotels':
          if( !isAuthenticated ){
            this.router.navigate(['login']);
            return false;

          } else {
            return true;
          }

        case '/dashboard/rooms':
          if( !isAuthenticated ){
            this.router.navigate(['login']);
            return false;
  
          } else {
            return true;
          } 
          
        case '/dashboard/reservations':
          if( !isAuthenticated ){
            this.router.navigate(['login']);
            return false;
  
          } else {
            return true;
          }  
          
        case '/dashboard/bills':
          if( !isAuthenticated ){
            this.router.navigate(['login']);
            return false;
    
          } else {
            return true;
          }    
        
        case '/dashboard/charts':
        if( !isAuthenticated ){
          this.router.navigate(['login']);
          return false;
    
          } else {
            return true;
          }    

        case '/login': 
          if( !isAuthenticated ) return true;
          if( isAuthenticated ) {
            this.router.navigate(['dashboard/hotels']);
            return false;
          }
          
      }

  }
  
}
