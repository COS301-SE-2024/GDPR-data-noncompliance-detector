import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent {

  mockData: any = {
    email1: {rating: 80, origin: 'Netherlands', violationAreas: 'Personal Information', numViolations: 16},
    email2: {rating: 37, origin: 'France', violationAreas: 'Banking Details', numViolations: 29},
    email3: {rating: 54, origin: 'Greece', violationAreas: 'Personal Information', numViolations: 6},
    email4: {rating: 37, origin: 'England', violationAreas: 'Banking Details', numViolations: 9},
    email5: {rating: 37, origin: 'Germany', violationAreas: 'Personal Information', numViolations: 19},
    email6: {rating: 37, origin: 'Spain', violationAreas: 'Banking Details', numViolations: 12},
  };

  //Initialise empty array as no data yet
  currentAnalysis: any = {};
  currentEmail: string = "";                                                   

  showAnalysis(data: string) {
    this.currentAnalysis = this.mockData[data];
    this.currentEmail = data;
  }

  isObjectEmpty(obj: any) {
    return Object.keys(obj).length === 0;
  }

  clearAnalysis() {
    this.currentAnalysis = {};
    this.currentEmail = "";
  }
}
