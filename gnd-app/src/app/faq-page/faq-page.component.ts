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
  activeDropdown: string = '';

  faqs = [
    { id: 'faq1', question: 'What is GDPR?', answer: 'GDPR stands for General Data Protection Regulation.' },
    { id: 'faq2', question: 'How do I report a violation?', answer: 'You can report a violation by contacting our support.' },
    { id: 'faq3', question: 'What rights do I have under GDPR?', answer: 'You have the right to access, correct, and delete your personal data.' },
    // Add more FAQs as needed
  ];

  toggleDropdown(dropdownId: string) {
    this.activeDropdown = this.activeDropdown === dropdownId ? '' : dropdownId;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.activeDropdown = ''; // Close dropdown if clicked outside
    }
  }
}
