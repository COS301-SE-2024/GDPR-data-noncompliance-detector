import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from "@angular/router";
import * as bcrypt from 'bcryptjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(300)),
    ])
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;
  private supabase: SupabaseClient;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

  }

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onLoginSubmit() {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;

      try {
        // Query the admin_user table for the given email
        const { data, error } = await this.supabase
          .from('admin_user')
          .select('*')
          .eq('email_address', formValues.email)
          .single();

        if (error) throw error;

        if (data) {
          // Compare the provided password with the stored hash
          const isPasswordValid = await bcrypt.compare(formValues.password, data.password);

          if (isPasswordValid) {
            console.log('Login successful', data);
            this.authService.login();
            this.router.navigate(['/home']);
            
          } else {
            console.log('Invalid credentials');
            // TODO: Show error message to user
          }
        } else {
          console.log('User not found');
          // TODO: Show error message to user
        }

      } catch (error) {
        console.error('Error during login:', error);
        // TODO: Implement error handling, show error message to user
      }
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
