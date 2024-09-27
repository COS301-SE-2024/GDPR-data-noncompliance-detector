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
  showSuccessToast: boolean = false; 
  showError: boolean = false;
  private supabase: SupabaseClient;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  ngOnInit() {
    this.initForm();
    
    // Reset error message when form changes
    this.loginForm.valueChanges.subscribe(() => {
      this.showError = false;
    });
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
        const { data, error } = await this.supabase
          .from('admin_user')
          .select('*')
          .eq('email_address', formValues.email)
          .single();

        if (error) throw error;

        if (data) {
          const isPasswordValid = await bcrypt.compare(formValues.password, data.password);
          if (isPasswordValid) {
            this.authService.login();
            // Show success toast and hide it after 3 seconds
            this.showSuccessToast = true;
            setTimeout(() => this.showSuccessToast = false, 3000);
            
            this.router.navigate(['/home']);
            
            
          } else {
            this.showError = true; 
          }
        } else {
          this.showError = true; 
        }

      } catch (error) {
        this.showError = true; 
        // console.error('Error during login:', error);
      }
    } else {
      // Trigger validation error messages
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}

