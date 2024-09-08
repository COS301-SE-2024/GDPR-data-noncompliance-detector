// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import {RouterLink} from "@angular/router";
//
// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterLink],
//   templateUrl: './register.component.html',
//   styleUrl: './register.component.css'
// })
// export class RegisterComponent {
//   showRegisterForm = false;
//
//   // Register form fields
//   firstName = '';
//   lastName = '';
//   registerEmail = '';
//   registerPassword = '';
//   confirmPassword = '';
//   agreeTerms = false;
//
//   onRegisterSubmit() {
//     // Implement registration logic here
//     // lets make sure the user is able to see the values they entered in the form and give error if the user tries to submit the form with empty fields
//     console.log('Register submitted', this.firstName, this.lastName, this.registerEmail, this.registerPassword);
//     if (!this.firstName || !this.lastName || !this.registerEmail || !this.registerPassword) {
//       alert('Please fill out all fields');
//       return;
//     }
//     this.showRegisterForm = false;
//
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import * as bcrypt from 'bcryptjs';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(300)),
    ])
  ]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup; // Add the non-null assertion operator
  passwordStrength: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });

    this.registerForm.get('password')?.valueChanges.subscribe(
      (password) => this.checkPasswordStrength(password)
    );
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  checkPasswordStrength(password: string) {
    const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
    const mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');

    if (strongRegex.test(password)) {
      this.passwordStrength = 'strong';
    } else if (mediumRegex.test(password)) {
      this.passwordStrength = 'medium';
    } else {
      this.passwordStrength = 'weak';
    }
  }

  async onRegisterSubmit() {
    if (this.registerForm.valid) {
      const formValues = this.registerForm.value;

      // Hash and salt the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(formValues.password, salt);

      // This is the data that will be going to the backend
      console.log('Register submitted', {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        password: hashedPassword //The password here is hashed
      });

      // Reset the form
      this.registerForm.reset();
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
