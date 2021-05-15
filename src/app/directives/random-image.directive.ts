import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[randomImage]'
})
export class RandomImageDirective {

  constructor( private element: ElementRef ) {
    this.element.nativeElement.src = 'https://source.unsplash.com/featured/600x300/?hotel,landscape' + '?q=' + new Date().getTime();
  }

}
