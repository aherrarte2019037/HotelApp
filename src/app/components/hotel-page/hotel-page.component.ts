import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Hotel } from 'src/app/models/hotel.model';
import { HotelService } from 'src/app/services/hotel.service';

@Component({
  selector: 'app-hotel-page',
  templateUrl: './hotel-page.component.html',
  styleUrls: ['./hotel-page.component.css']
})
export class HotelPageComponent implements OnInit {
  hotels$: Observable<Hotel[]> = this.hotelService.getAll();

  constructor( private hotelService: HotelService ) { }

  ngOnInit(): void { }

}
