// import { Injectable } from '@angular/core';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//
//   constructor() { }
// }
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }

  setToken(token: string): void {
    localStorage.setItem('userToken', token);
  }

  removeToken(): void {
    localStorage.removeItem('userToken');
  }
}
