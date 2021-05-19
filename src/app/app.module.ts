import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SidebarModule } from 'ng-sidebar';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http'; 
import { NgxSpinnerModule } from "ngx-spinner";
import { AppComponent } from './components/main/app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HotelPageComponent } from './components/hotel-page/hotel-page.component';
import { DecimalPipe } from '@angular/common';
import { RandomScorePipe } from './pipes/random-score.pipe';
import { RandomImageDirective } from './directives/random-image.directive';
import { RoomPageComponent } from './components/room-page/room-page.component';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { TruncateTextPipe } from './pipes/truncate-text.pipe';
import { ReservationsPageComponent } from './components/reservations-page/reservations-page.component';
import { ServiceQuantityPipe } from './pipes/service-quantity.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    LoginComponent,
    RegisterComponent,
    HotelPageComponent,
    RandomScorePipe,
    RandomImageDirective,
    RoomPageComponent,
    SearchFilterPipe,
    TruncateTextPipe,
    ReservationsPageComponent,
    ServiceQuantityPipe,
  ],
  imports: [
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    SnotifyModule,
    MatDatepickerModule,
    MatButtonModule,
    MatInputModule,
    MatNativeDateModule,
    SidebarModule.forRoot(),
    NoopAnimationsModule
  ],
  providers: [
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    SnotifyService,
    DecimalPipe,
    SearchFilterPipe,
    TruncateTextPipe
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
