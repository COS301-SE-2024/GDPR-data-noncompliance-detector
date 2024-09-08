import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  showLoginForm = true;
  showRegisterForm = false;

  // Login form fields
  loginEmail = '';
  loginPassword = '';

  // Register form fields
  firstName = '';
  lastName = '';
  registerEmail = '';
  registerPassword = '';
  confirmPassword = '';
  agreeTerms = false;

  toggleForms() {
    this.showRegisterForm = !this.showRegisterForm;
  }

  onLoginSubmit() {
    // Implement login logic here
    console.log('Login submitted', this.loginEmail, this.loginPassword);
  }


  onRegisterSubmit() {
    // Implement registration logic here
    console.log('Register submitted', this.firstName, this.lastName, this.registerEmail, this.registerPassword);
  }
}
