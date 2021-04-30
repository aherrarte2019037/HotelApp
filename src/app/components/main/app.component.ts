import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor( private router: Router, private spinner: NgxSpinnerService ) {
    
  }

  spinnerHandler(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      if( event.url === '/dashboard' ) this.spinner.show();
    }
    if (event instanceof NavigationEnd) {
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    }

    if (event instanceof NavigationCancel) {
      this.spinner.hide();
    }
    if (event instanceof NavigationError) {
      this.spinner.hide();
    }

  }

}
