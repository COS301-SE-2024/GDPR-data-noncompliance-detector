// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   isLoggedIn = new BehaviorSubject<boolean>(false);

//   login() {
//     this.isLoggedIn.next(true);
//   }

//   logout() {
//     this.isLoggedIn.next(false);
//     localStorage.removeItem('token');
//   }
// }

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = new BehaviorSubject<boolean>(this.checkLoginStatus());

  login() {
    this.isLoggedIn.next(true);
    // Store your auth token here
    localStorage.setItem('token', 'your-auth-token'); 
  }

  logout() {
    this.isLoggedIn.next(false);
    localStorage.removeItem('token');
  }

  private checkLoginStatus(): boolean {
    return localStorage.getItem('token') !== null;
  }
}
