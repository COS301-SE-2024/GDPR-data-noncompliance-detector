import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngClass

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './faq-page.component.html',
  styleUrl: './faq-page.component.css'
})
export class FaqPageComponent {
  activeDropdown: string = '';  // To store the currently active dropdown

  // Function to toggle the dropdown
  toggleDropdown(dropdownId: string) {
    if (this.activeDropdown === dropdownId) {
        this.activeDropdown = ''; // Close dropdown
    } else {
        this.activeDropdown = dropdownId; // Open new dropdown
    }
}

}