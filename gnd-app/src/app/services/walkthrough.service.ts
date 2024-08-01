import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WalkthroughService {
  private walkthroughSubject = new Subject<void>();

  walkthroughRequested$ = this.walkthroughSubject.asObservable();

  requestwalkthrough() {
    this.walkthroughSubject.next();
  }
  // constructor() { }
}
