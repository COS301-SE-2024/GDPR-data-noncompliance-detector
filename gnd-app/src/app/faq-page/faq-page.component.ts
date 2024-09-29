import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.css']
})
export class FaqPageComponent {
  activeDropdown: string | undefined; // Change this to undefined

  toggleDropdown(dropdownId: string) {
    if (this.activeDropdown === dropdownId) {
      this.activeDropdown = undefined; // Close dropdown
    } else {
      this.activeDropdown = dropdownId; // Open new dropdown
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Check if the click was outside the dropdown button or content
    if (!target.closest('.dropdown')) {
      this.activeDropdown = undefined; // Close dropdown if clicked outside
    }
  }
}
