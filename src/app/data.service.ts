import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  ppl:string[] = [];
  words:string[] = [];
  text:string;

  constructor() { }
}
