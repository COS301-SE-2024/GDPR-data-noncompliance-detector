// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { LoginComponent } from './login.component';
// import { ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';
// import { createClient } from '@supabase/supabase-js';
// import * as bcrypt from 'bcryptjs';

// describe('LoginComponent', () => {
//   let component: LoginComponent;
//   let fixture: ComponentFixture<LoginComponent>;
//   let authServiceMock: any;
//   let routerMock: any;
//   let supabaseMock: any;

//   beforeEach(async () => {
//     authServiceMock = { login: jasmine.createSpy('login') };
//     routerMock = { navigate: jasmine.createSpy('navigate') };
//     supabaseMock = {
//       from: () => ({
//         select: () => ({
//           eq: () => ({
//             single: () => Promise.resolve({ data: null, error: null })
//           })
//         })
//       })
//     };

//     await TestBed.configureTestingModule({
//       imports: [ReactiveFormsModule],
//       declarations: [LoginComponent],
//       providers: [
//         { provide: AuthService, useValue: authServiceMock },
//         { provide: Router, useValue: routerMock },
//         { provide: createClient, useValue: supabaseMock }
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(LoginComponent);
//     component = fixture.componentInstance;
//   });

//   it('should initialize the form on ngOnInit', () => {
//     component.ngOnInit();
//     expect(component.loginForm).toBeDefined();
//     expect(component.loginForm.controls['email']).toBeDefined();
//     expect(component.loginForm.controls['password']).toBeDefined();
//   });

//   it('should toggle password visibility', () => {
//     component.togglePasswordVisibility();
//     expect(component.showPassword).toBeTrue();
//     component.togglePasswordVisibility();
//     expect(component.showPassword).toBeFalse();
//   });

//   it('should submit login form successfully', async () => {
//     const hashedPassword = await bcrypt.hash('password', 10);
//     component.loginForm.setValue({ email: 'test@example.com', password: 'password' });
//     supabaseMock.from = () => ({
//       select: () => ({
//         eq: () => ({
//           single: () => Promise.resolve({ data: { password: hashedPassword }, error: null })
//         })
//       })
//     });

//     await component.onLoginSubmit();
//     expect(authServiceMock.login).toHaveBeenCalled();
//     expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
//   });

//   it('should show error for invalid password', async () => {
//     const hashedPassword = await bcrypt.hash('password', 10);
//     component.loginForm.setValue({ email: 'test@example.com', password: 'wrongpassword' });
//     supabaseMock.from = () => ({
//       select: () => ({
//         eq: () => ({
//           single: () => Promise.resolve({ data: { password: hashedPassword }, error: null })
//         })
//       })
//     });

//     await component.onLoginSubmit();
//     expect(component.showError).toBeTrue();
//   });

//   it('should handle error during login', async () => {
//     component.loginForm.setValue({ email: 'test@example.com', password: 'password' });
//     supabaseMock.from = () => ({
//       select: () => ({
//         eq: () => ({
//           single: () => Promise.reject('Error')
//         })
//       })
//     });

//     await component.onLoginSubmit();
//     expect(component.showError).toBeTrue();
//   });

//   it('should mark controls as touched on invalid form submission', () => {
//     component.loginForm.setValue({ email: '', password: '' });
//     component.onLoginSubmit();
//     expect(component.loginForm.controls['email'].touched).toBeTrue();
//     expect(component.loginForm.controls['password'].touched).toBeTrue();
//   });
// });