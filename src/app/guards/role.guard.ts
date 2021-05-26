import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { User, UserRoles } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor( private authService: AuthService, private router: Router ) { }

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const role: UserRoles = route.data.block;
    const allow: UserRoles = route.data.allow || false;

    if( allow === this.authService.getRoleAuthenticated() ) return true;
    if( role !== this.authService.getRoleAuthenticated() ) return true;

    this.router.navigate(['login']);
    return false;
  }
  
}