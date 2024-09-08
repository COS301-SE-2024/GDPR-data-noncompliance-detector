import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from "@angular/router";
import * as bcrypt from 'bcryptjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

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
  registerForm!: FormGroup;
  passwordStrength: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  private supabase: SupabaseClient;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    // this.supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_KEY');
    this.supabase = createClient('https://oadcyxznbhdrzsutusbh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZGN5eHpuYmhkcnpzdXR1c2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4MTAyNDUsImV4cCI6MjA0MTM4NjI0NX0.DLDq7NyjhmEv9V1bRERp2e5XT0-qFdBjWN3BNed6EfY');

  }

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

  // async onRegisterSubmit() {
  //   if (this.registerForm.valid) {
  //     const formValues = this.registerForm.value;
  //
  //     // Hash and salt the password
  //     const salt = await bcrypt.genSalt(10);
  //     const hashedPassword = await bcrypt.hash(formValues.password, salt);
  //
  //     // This is the data that will be going to the backend
  //     console.log('Register submitted', {
  //       firstName: formValues.firstName,
  //       lastName: formValues.lastName,
  //       email: formValues.email,
  //       password: hashedPassword //The password here is hashed
  //     });
  //
  //     // Reset the form
  //     this.registerForm.reset();
  //   } else {
  //     // Mark all fields as touched to trigger validation messages
  //     Object.keys(this.registerForm.controls).forEach(key => {
  //       const control = this.registerForm.get(key);
  //       control?.markAsTouched();
  //     });
  //   }
  // }

  async onRegisterSubmit() {
    if (this.registerForm.valid) {
      const formValues = this.registerForm.value;

      try {
        // Hash the password
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
              password: hashedPassword // Store the hashed password
            }
          ]);

        if (error) throw error;

        console.log('User registered successfully', data);
        // TODO: Implement success message or redirect to login page
        this.router.navigate(['/login']);

        // Reset the form
        this.registerForm.reset();
      } catch (error) {
        console.error('Error registering user:', error);
        // TODO: Implement error handling, show error message to user
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
