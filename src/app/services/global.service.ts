import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  apiUrl: string = 'http://localhost:3000';

  constructor() { }

  getApiUrl(): string {
    return this.apiUrl;
  }

}
