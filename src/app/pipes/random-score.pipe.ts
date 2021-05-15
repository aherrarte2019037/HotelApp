import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'randomScore'
})
export class RandomScorePipe implements PipeTransform {
  randomFeatures = ['wifi', 'wine', 'thermometer', 'moon', 'football', 'musical-notes', 'bag', 'bus', 'call', 'game-controller', 'paw', 'restaurant', 'storefront', 'finger-print']

  constructor( private decimalPipe: DecimalPipe ) { }

  transform( value: unknown, isRandomFeature: boolean = false ): unknown {

    if( isRandomFeature ) {
      return this.getRandomFeature();

    } else {
      return this.getRandomScore();
    }

  }

  getRandomScore() {
    let random = this.decimalPipe.transform( Math.random() * (9 - 6 + 1) + 6, '1.1-1' )
    const n = (random + "").split(".");
    if( n[1] === "0" ) random = this.decimalPipe.transform( Math.random() * (9 - 6 + 1) + 6, '1.1-1' );
    return random;
  }

  getRandomFeature() {
    const random = this.decimalPipe.transform( Math.random() * (12 - 0 + 1) + 0, '1.0-0' );    
    return this.randomFeatures[random];
  }

}
