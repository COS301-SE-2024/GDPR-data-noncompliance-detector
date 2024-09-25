import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.css'] // Fixed styleUrl to styleUrls
})
export class FaqPageComponent {
  activeDropdown: string = ''; // To store the currently active dropdown

  // Function to toggle the dropdown
  toggleDropdown(dropdownId: string) {
    if (this.activeDropdown === dropdownId) {
      this.activeDropdown = ''; // Close dropdown
    } else {
      this.activeDropdown = dropdownId; // Open new dropdown
    }
  }

  // HostListener to detect clicks outside the dropdown
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Check if the click was outside the dropdown button or content
    if (!target.closest('.dropdown')) {
      this.activeDropdown = ''; // Close dropdown if clicked outside
    }
  }
}
