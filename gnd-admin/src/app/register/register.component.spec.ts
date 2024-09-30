
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { of, throwError } from 'rxjs';
// import * as bcrypt from 'bcryptjs';
// import { RegisterComponent } from './register.component';
// import { AuthService } from '../services/auth.service';
// import { createClient, SupabaseClient } from '@supabase/supabase-js';
// import { environment } from '../../environments/environment';

// describe('RegisterComponent', () => {
//   let component: RegisterComponent;
//   let fixture: ComponentFixture<RegisterComponent>;
//   let authServiceMock: any;
//   let routerMock: any;
//   let supabaseMock: any;

//   beforeEach(async () => {
//     authServiceMock = {
//       login: jasmine.createSpy('login')
//     };

//     routerMock = {
//       navigate: jasmine.createSpy('navigate')
//     };

//     supabaseMock = {
//       from: jasmine.createSpy('from').and.returnValue({
//         insert: jasmine.createSpy('insert').and.returnValue(Promise.resolve({ data: {}, error: null }))
//       })
//     };

//     await TestBed.configureTestingModule({
//       declarations: [RegisterComponent],
//       imports: [ReactiveFormsModule],
//       providers: [
//         { provide: AuthService, useValue: authServiceMock },
//         { provide: Router, useValue: routerMock },
//         { provide: SupabaseClient, useValue: supabaseMock }
//       ]
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(RegisterComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize the form', () => {
//     component.ngOnInit();
//     expect(component.registerForm).toBeDefined();
//   });

//   it('should toggle password visibility', () => {
//     component.showPassword = false;
//     component.togglePasswordVisibility();
//     expect(component.showPassword).toBeTrue();
//   });

//   it('should toggle confirm password visibility', () => {
//     component.showConfirmPassword = false;
//     component.toggleConfirmPasswordVisibility();
//     expect(component.showConfirmPassword).toBeTrue();
//   });

//   it('should update password conditions', () => {
//     component.updatePasswordConditions('Test123!');
//     expect(component.passwordConditions.length).toBeTrue();
//     expect(component.passwordConditions.uppercase).toBeTrue();
//     expect(component.passwordConditions.lowercase).toBeTrue();
//     expect(component.passwordConditions.number).toBeTrue();
//     expect(component.passwordConditions.specialChar).toBeTrue();
//   });

//   it('should check password strength', () => {
//     component.checkPasswordStrength('Test123!');
//     expect(component.passwordStrength).toBe('medium');
//   });

//   it('should handle successful registration', async () => {
//     component.registerForm.setValue({
//       firstName: 'John',
//       lastName: 'Doe',
//       email: 'john.doe@example.com',
//       password: 'Test123!',
//       confirmPassword: 'Test123!',
//       agreeTerms: true
//     });

//     spyOn(bcrypt, 'genSalt').and.callFake(() => Promise.resolve('salt'));
//     spyOn(bcrypt, 'hash').and.callFake(() => Promise.resolve('hashedPassword'));

//     await component.onRegisterSubmit();
//     expect(authServiceMock.login).toHaveBeenCalled();
//     expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
//     expect(component.registerForm.value).toEqual({
//       firstName: '',
//       lastName: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//       agreeTerms: false
//     });
//   });

//   it('should handle registration errors', async () => {
//     component.registerForm.setValue({
//       firstName: 'John',
//       lastName: 'Doe',
//       email: 'john.doe@example.com',
//       password: 'Test123!',
//       confirmPassword: 'Test123!',
//       agreeTerms: true
//     });

//     spyOn(bcrypt, 'genSalt').and.callFake(() => Promise.resolve('salt'));
//     spyOn(bcrypt, 'hash').and.callFake(() => Promise.resolve('hashedPassword'));
//     supabaseMock.from.and.returnValue({
//       insert: () => Promise.reject('Registration error')
//     });

//     await component.onRegisterSubmit();
//     expect(component.showError).toBeTrue();
//   });
// });