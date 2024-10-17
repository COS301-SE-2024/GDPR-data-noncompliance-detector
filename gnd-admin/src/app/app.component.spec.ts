import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'gnd-admin' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('gnd-admin');
  });

  it('should have a login link', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const loginLink = compiled.querySelector('a[href="/login"]');
    expect(loginLink).toBeTruthy();
  });

  it('should have a logout link', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const logoutLink = compiled.querySelector('a[href="/landing"]');
    expect(logoutLink).toBeTruthy();
  });

  it('should navigate to dashboard on login', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    // Simulate login
    app.isLoggedIn = true; // Set logged-in state
    fixture.detectChanges(); // Trigger change detection

    // Check if navigation to dashboard was triggered
    fixture.whenStable().then(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });
  });


  it('should display dashboard link when logged in', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.isLoggedIn = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const dashboardLink = compiled.querySelector('a[href="/home"]');
    expect(dashboardLink).toBeTruthy();
  });

  it('should not display dashboard link when not logged in', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.isLoggedIn = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const dashboardLink = compiled.querySelector('a[href="/home"]');
    expect(dashboardLink).toBeFalsy();
  });
});