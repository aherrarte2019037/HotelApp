import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  menuOpen: boolean = false;
  searchOpen: boolean = false;

  constructor() { }

  ngOnInit() { };

  change( value: string ) {
    this.searchOpen = value.length === 0 ? false:true; 
  }

  changeButton( value: string ) {
    if( value.length > 0  ) return this.searchOpen = true;
    this.searchOpen = !this.searchOpen;
  }

}
