import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService); // Get the instance of AuthService
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have an initial logged out state', () => {
    expect(service.isLoggedIn.getValue()).toBeFalse();
  });

  it('should set isLoggedIn to true when login is called', () => {
    service.login();
    expect(service.isLoggedIn.getValue()).toBeTrue();
  });

  it('should set isLoggedIn to false when logout is called', () => {
    service.login(); // First, log in
    service.logout();
    expect(service.isLoggedIn.getValue()).toBeFalse();
  });

  it('should remove token from localStorage on logout', () => {
    spyOn(localStorage, 'removeItem');
    service.logout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });
});
