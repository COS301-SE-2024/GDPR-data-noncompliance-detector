import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from "@angular/router";
import * as bcrypt from 'bcryptjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
import { TermsComponent } from '../terms/terms.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TermsComponent],
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
  registerForm!: FormGroup;
  passwordStrength: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  showError: boolean = false;
  errorRegistering: boolean = false;
  passwordConditions = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  };
  private supabase: SupabaseClient;

  constructor(private formBuilder: FormBuilder, private router: Router,private authService: AuthService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

  }

  ngOnInit() {
    this.initForm();
        // Reset error message when form changes
        this.registerForm.valueChanges.subscribe(() => {
          this.showError = false;
        });
  }

  // openTermsModal() {
  //   const modal = document.getElementById('termsModal');
  //   if (modal) {
  //     modal.style.display = 'block';
  //   }
  // }
  // openTermsModal(event: Event) {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   const modal = document.getElementById('termsModal');
  //   if (modal) {
  //     modal.style.display = 'block';
  //   }
  // }
  openTermsModal(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const modal = document.getElementById('termsModal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }
  

  private initForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=(?:.{20,}|(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}))[\w@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });

    this.registerForm.get('password')?.valueChanges.subscribe(
      (password) =>{
        this.checkPasswordStrength(password);
        this.updatePasswordConditions(password);
      }
    );
  }
  updatePasswordConditions(password: string) {
    this.passwordConditions.length = password.length >= 8;
    this.passwordConditions.uppercase = /[A-Z]/.test(password);
    this.passwordConditions.lowercase = /[a-z]/.test(password);
    this.passwordConditions.number = /\d/.test(password);
    this.passwordConditions.specialChar = /[@$!%*?&]/.test(password);
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

      try {
        // Hashing the passwords
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(formValues.password, salt);

        // Insert the new user into the admin_user table
        const { data, error } = await this.supabase
          .from('admin_user')
          .insert([
            {
              first_name: formValues.firstName,
              last_name: formValues.lastName,
              email_address: formValues.email,
              password: hashedPassword 
            }
          ]);

        if (error) throw error;

        // console.log('User registered successfully', data);
        this.authService.login();
        this.router.navigate(['/login']);

        // Reset the form
        this.registerForm.reset();
      } catch (error) {
        this.showError = true;
        // console.error('Error registering user:', error);
      }
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
