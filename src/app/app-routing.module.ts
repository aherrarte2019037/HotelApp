import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelPageComponent } from './components/hotel-page/hotel-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RoomPageComponent } from './components/room-page/room-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: SidebarComponent, canActivate: [AuthGuard], children: [
    { path: 'hotels', component: HotelPageComponent },
    { path: 'rooms', component: RoomPageComponent },
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
