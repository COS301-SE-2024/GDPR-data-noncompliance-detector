import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { FileService } from '../services/file.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  reports: string[] = [];
  // path: string = '../backend/Reports';
  path: string = '../backend/Reports';
  private apiUrl = 'http://127.0.0.1:8000/reports';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getReports();
  }

  getReports(): void{
    this.fetchFiles(this.path).subscribe(r => {
      this.reports = r;
    });
    
    console.log('---------------------------------')
    console.log(this.reports)
  }

  fetchFiles(directory: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}?directory=${directory}`);
  }

  // mockData: any = {
  //   email1: {rating: 80, origin: 'Netherlands', violationAreas: 'Personal Information', numViolations: 16, fileType: 'pdf'},
  //   email2: {rating: 37, origin: 'France', violationAreas: 'Banking Details', numViolations: 29, fileType: 'doc'},
  //   email3: {rating: 54, origin: 'Greece', violationAreas: 'Personal Information', numViolations: 6, fileType: 'xlsx'},
  //   email4: {rating: 37, origin: 'England', violationAreas: 'Banking Details', numViolations: 9, fileType: 'xlsx'},
  //   email5: {rating: 37, origin: 'Germany', violationAreas: 'Personal Information', numViolations: 19, fileType: 'pdf'},
  //   email6: {rating: 37, origin: 'Spain', violationAreas: 'Banking Details', numViolations: 12, fileType: 'txt'},
  // };

  currentAnalysis: any = {};
  currentEmail: string = "";  
  currentEmailType: string = ""; // Add this line to track file type

  // showAnalysis(data: string) {
  //   this.currentAnalysis = this.mockData[data];
  //   this.currentEmail = data;
  //   this.currentEmailType = this.mockData[data].fileType; // Set file type
  // }

  isObjectEmpty(obj: any) {
    return Object.keys(obj).length === 0;
  }

  clearAnalysis() {
    this.currentAnalysis = {};
    this.currentEmail = "";
    this.currentEmailType = ""; // Clear file type
  }
}
