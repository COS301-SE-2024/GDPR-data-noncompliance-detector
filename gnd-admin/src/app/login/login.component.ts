import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showLoginForm = true;

  // Login form fields
  loginEmail = '';
  loginPassword = '';

  onLoginSubmit() {
    // Implement login logic here
    console.log('Login submitted', this.loginEmail, this.loginPassword);
  }

}
