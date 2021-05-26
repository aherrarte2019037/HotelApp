import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillsPageComponent } from './components/bills-page/bills-page.component';
import { ChartsPageComponent } from './components/charts-page/charts-page.component';
import { HotelPageComponent } from './components/hotel-page/hotel-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ReservationsPageComponent } from './components/reservations-page/reservations-page.component';
import { RoomPageComponent } from './components/room-page/room-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleAppGuard } from './guards/role-app.guard';
import { RoleGuard } from './guards/role.guard';
import { UserRoles } from './models/user.model';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: SidebarComponent, canActivate: [AuthGuard], children: [
    { path: 'hotels', component: HotelPageComponent },
    { path: 'rooms', component: RoomPageComponent },
    { path: 'reservations', component: ReservationsPageComponent, canActivate: [RoleGuard], data: { role: UserRoles.client } },
    { path: 'bills', component: BillsPageComponent, canActivate: [RoleGuard], data: { block: UserRoles.app_admin } },
    { path: 'charts', component: ChartsPageComponent, canActivate: [RoleAppGuard] },
    { path: '', pathMatch: 'full', redirectTo: 'hotels' },
    { path: '**', pathMatch: 'full', redirectTo: 'hotels' }
  ]},
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({

  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
