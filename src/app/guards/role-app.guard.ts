import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UserRoles } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleAppGuard implements CanActivate {

  constructor( private authService: AuthService, private router: Router ) { }

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if( this.authService.getRoleAuthenticated() === UserRoles.app_admin ) return true;

    this.router.navigate(['login']);
    return false;
  }
  
}
