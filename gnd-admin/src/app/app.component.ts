import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class AppComponent implements OnInit {
  title = 'gnd-admin';
  isLoggedIn = false;
  isMenuOpen = false; 

  constructor(private authService: AuthService, private router: Router) {
    // Subscribing to the isLoggedIn status from AuthService
    this.authService.isLoggedIn.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; 
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/landing']).then(() => {
      window.location.reload();
    });
  }

  ngOnInit(): void {
    initFlowbite();
  }

  
}
