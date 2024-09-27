// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
// import { initFlowbite } from 'flowbite';
// import { AuthService } from './services/auth.service';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css'] 
// })
// export class AppComponent implements OnInit {
//   title = 'gnd-admin';
//   isLoggedIn =false;
//   constructor(private authService: AuthService, private router: Router) {
//     this.authService.isLoggedIn.subscribe(status => {
//       this.isLoggedIn = status;
//     });
//   }

//   logout(){
//     this.authService.logout();
//     this.router.navigate(['/landing']);

//   }

//   ngOnInit(): void {
//     initFlowbite();
//   }
  
// }
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
  isMenuOpen = false; // Add this property

  constructor(private authService: AuthService, private router: Router) {
    // Subscribe to the isLoggedIn status from AuthService
    this.authService.isLoggedIn.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; // Toggle the menu state
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/landing']);
  }

  ngOnInit(): void {
    // Initialize Flowbite
    initFlowbite();
  }

  
}
