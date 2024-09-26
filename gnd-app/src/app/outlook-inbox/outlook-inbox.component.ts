import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
// import { FileService } from '../services/file.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import axios from 'axios';

import { Subscription } from 'rxjs';
import * as introJs from 'intro.js/intro.js';
import {WalkthroughService} from '../services/walkthrough.service';

@Component({
  selector: 'app-outlook-inbox',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './outlook-inbox.component.html',
  styleUrl: './outlook-inbox.component.css'
})
export class OutlookInboxComponent implements OnInit, OnDestroy {
  private walkthroughSubscription?: Subscription;


  reports: string[] = [];
  path: string = '../backend/Reports';
  private apiUrl = 'http://127.0.0.1:8000/outlook-results';
  private iUrl = 'http://127.0.0.1:8000/read-outlook-results';
  public currentAnalysis: any = {};
  public currentEmail: string = "";  
  public currentEmailType: string = "";
  result: string = '';
  status: string = '';
  ca_statement: string = '';
  // currentAnalysis: any = {};

  constructor(private http: HttpClient, private walkthroughService: WalkthroughService, private router: Router) { }

  ngOnInit(): void {

    this.getDataFolder().subscribe(response => {
      this.path = response.outlook_data_folder;
      this.getReports();
    });

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

  getDataFolder(): Observable<{ outlook_data_folder: string }> {
    return this.http.get<{ outlook_data_folder: string }>('http://127.0.0.1:8000/get-data-folder');
  }

  navigateToDownloads(): void {
    this.router.navigate(['/inbox'])
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

  documentStatus: string = "";
  nerCount: number = 0;
  location: string = "";
  personalData: number = 0;
  financialData: number = 0;
  contactData: number = 0;
  medicalData: number = 0;
  ethnicData: number = 0;
  biometricData: number = 0;
  consentAgreement: string = "";

  docStatus(status: number): string {
    if(status == 1){
      return "Compliant"
    }
    return "Non-Compliant"
  }

  locationStatus(location: number): string {
    if(location == 0 ) {
      return "Not EU"
    }

    else if(location == 1) {
      return "EU"
    }

    return "Not Available"
  }

  consentAgreementStatus(consent: boolean): string {
    if(consent == true) {
      return "The document does appear to contain data consent agreements";
    }

    return "The document does not seem to contain any data consent agreements";
  }

  extractCountryFromFileName(fileName: string): string {
    const parts = fileName.split(' - ');
  
    if (parts.length >= 2) {
        return parts[1].replace(/\.[^/.]+$/, "");
    }

    return "Not Available";
  }

  getFileNameWithoutCountry(fileName: string): string {
    const parts = fileName.split(' - ');

    return parts[0];
  }

  getReportContent(filePath: string) {
    console.log(filePath);
    
    const fileName = filePath.split('/').pop() || filePath;
    const country = this.extractCountryFromFileName(fileName);
  
    this.location = country;

    const payload = { path: filePath };
    axios.post(this.iUrl, payload)
      .then(response => {
        // this.currentAnalysis.content = response.data.content;
        // this.result = this.processResult(this.currentAnalysis.content)
        // const correctedData = response.data.content.replace(/'/g, '"');
        const correctedData = response.data.content.replace(/'/g, '"').replace(/True/g, 'true').replace(/False/g, 'false');
        
        // console.log('Corrected JSON Data:', correctedData);
    
        let dat = JSON.parse(correctedData);
        
        const score = dat.result.score;

        this.documentStatus = this.docStatus(score.Status);

        this.nerCount = score.NER;
        // this.location = this.locationStatus(score.Location);

        this.personalData = score.Personal;
        this.financialData = score.Financial;
        this.contactData = score.Contact;
        this.medicalData = score.Medical;
        this.ethnicData = score.Ethnic;
        this.biometricData = score.Biometric;
        this.consentAgreement = this.consentAgreementStatus(score["Consent Agreement"]);

        // this.checkdata();

        this.result = "Y";

      })
      .catch(error => {
        console.error('There was an error!', error);
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
      ],
    });
    intro.start();
  }
  toggleWalkthrough() {
    this.startIntro();
  }
}