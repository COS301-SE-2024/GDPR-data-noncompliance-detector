import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    authServiceMock = {
      isLoggedIn: new BehaviorSubject<boolean>(false)
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if user is logged in', () => {
    authServiceMock.isLoggedIn.next(true); // Simulating the user being logged in
    const canActivate = guard.canActivate();
    expect(canActivate).toBeTrue();
  });

  it('should block activation and redirect to "/login" if user is not logged in', () => {
    authServiceMock.isLoggedIn.next(false); // Simulating the user being logged out
    const canActivate = guard.canActivate();
    expect(canActivate).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
