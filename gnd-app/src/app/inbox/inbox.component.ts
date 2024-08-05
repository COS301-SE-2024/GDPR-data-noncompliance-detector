import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { FileService } from '../services/file.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import * as introJs from 'intro.js/intro.js';
import {WalkthroughService} from '../services/walkthrough.service';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit, OnDestroy {
  private walkthroughSubscription?: Subscription;


  reports: string[] = [];
  // path: string = '../backend/Reports';
  path: string = '../backend/Reports/';
  private apiUrl = 'http://127.0.0.1:8000/reports';
  private iUrl = 'http://127.0.0.1:8000/read-report/';

  constructor(private http: HttpClient, private walkthroughService: WalkthroughService) { }

  ngOnInit(): void {
    this.getReports();
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (!hasSeenIntro) {
      this.startIntro();
      // Mark that the user has seen the intro
      localStorage.setItem('hasSeenIntro', 'true');
    }
    this.walkthroughSubscription = this.walkthroughService.walkthroughRequested$.subscribe(()=>{
      this.startIntro();
    })
  }

  ngOnDestroy() {
    if(this.walkthroughSubscription)
      this.walkthroughSubscription.unsubscribe();
  }

  getReports(): void{
    this.fetchFiles(this.path).subscribe(r => {
      this.reports = r;
    });
    
    console.log('---------------------------------')
    console.log(this.reports)
  }

  fetchFiles(directory: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}`);
  }

  getReportContent(filePath: string) {
    
    console.log(filePath);
    this.http.get<{ content: string }>(`${this.iUrl}?path=${encodeURIComponent(this.path + filePath)}`).subscribe(response => {
      this.currentAnalysis.content = response.content;
    });
    this.currentEmail = 'NA';
    this.currentEmailType = 'txt';
  }

  mock(){
    this.currentAnalysis.content = 'sandwich spread ';
    this.currentEmail = 'NA';
    this.currentEmailType = 'txt'; // Set file type
  }

  smock(filePath: string){
    this.currentAnalysis.content = filePath;
    this.currentEmail = 'NA';
    this.currentEmailType = 'txt'; // Set file type
  }

  mockData: any = {
    email1: {rating: 80, origin: 'Netherlands', violationAreas: 'Personal Information', numViolations: 16, fileType: 'pdf'},
    email2: {rating: 37, origin: 'France', violationAreas: 'Banking Details', numViolations: 29, fileType: 'doc'},
    email3: {rating: 54, origin: 'Greece', violationAreas: 'Personal Information', numViolations: 6, fileType: 'xlsx'},
    email4: {rating: 37, origin: 'England', violationAreas: 'Banking Details', numViolations: 9, fileType: 'xlsx'},
    email5: {rating: 37, origin: 'Germany', violationAreas: 'Personal Information', numViolations: 19, fileType: 'pdf'},
    email6: {rating: 37, origin: 'Spain', violationAreas: 'Banking Details', numViolations: 12, fileType: 'txt'},
  };

  currentAnalysis: any = {};
  currentEmail: string = "";  
  currentEmailType: string = ""; // Add this line to track file type

  showAnalysis(data: string) {
    this.currentAnalysis = this.mockData[data];
    this.currentEmail = data;
    this.currentEmailType = this.mockData[data].fileType; // Set file type
  }

  isObjectEmpty(obj: any) {
    return Object.keys(obj).length === 0;
  }

  clearAnalysis() {
    this.currentAnalysis = {};
    this.currentEmail = "";
    this.currentEmailType = ""; // Clear file type
  }

  startIntro() {
    const intro = introJs();
    intro.setOptions({
      steps: [
        {
          element: '#InboxAttachments',
          intro: 'This is where you will see all the new attachments in the received inbox directory.'
        },
        // {
        //   element: '#ReportOfClickedDoc',
        //   intro: 'Here you will see the generated report of the selected document from the attachments on the left.'
        // }
      ],
    });
    intro.start();
  }
  toggleWalkthrough() {
    this.startIntro();
  }
}
