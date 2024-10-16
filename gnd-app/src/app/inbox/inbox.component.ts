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
import { ReportGenerationService, ViolationData } from '../services/report-generation.service';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit, OnDestroy {
  private walkthroughSubscription?: Subscription;


  reports: { name: string, modified: Date }[] = [];

  // path: string = '../backend/Reports';
  path: string = '../backend/Reports';
  private apiUrl = 'http://127.0.0.1:8000/downloads-results';
  private iUrl = 'http://127.0.0.1:8000/read-downloads-results';
  public currentAnalysis: any = {};
  public currentEmail: string = "";  
  public currentEmailType: string = ""; // Add this line to track file type
  result: string = '';
  status: string = '';
  ca_statement: string = '';
  // currentAnalysis: any = {};

  constructor(private http: HttpClient, private walkthroughService: WalkthroughService, private router: Router,
    private reportGenerationService: ReportGenerationService
  ) { }

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

  getDataFolder(): Observable<{ outlook_data_folder: string }> {
    return this.http.get<{ outlook_data_folder: string }>('http://127.0.0.1:8000/get-data-downloads-folder');
  }


  ngOnDestroy() {
    if(this.walkthroughSubscription)
      this.walkthroughSubscription.unsubscribe();
  }

  navigateToInbox(): void {
    this.router.navigate(['/outlook-inbox'])
  }

  getReports(): void {
    this.fetchFiles(this.path).subscribe(r => {
      this.reports = r.map(file => {
        return {
          name: file.name,
          modified: new Date(file.modified * 1000)
        };
      });
    });
  
    console.log('---------------------------------');
    console.log(this.reports);
  }

  fetchFiles(directory: string): Observable<{ name: string, modified: number }[]> {
    return this.http.get<{ name: string, modified: number }[]>(`${this.apiUrl}`);
  }


  // documentStatus: string = "";
  documentStatus: string = "";
  nerCount: number = 0;
  location: string = "";
  personalData: number = 0;
  financialData: number = 0;
  contactData: number = 0;
  medicalData: number = 0;
  ethnicData: number = 0;
  biometricData: number = 0;
  geneticData: number = 0;
  consentAgreement: string = "";
  ragScore: string = "";

  docStatus(status: number): string {
    if(status <= 0.6){
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

  getReportContent(filePath: string) {
    console.log(filePath);
    
    const fileName = filePath.split('/').pop() || filePath;
    // const country = this.extractCountryFromFileName(fileName);
  
    this.location = "N/A";

    const payload = { path: filePath };
    this.http.post(this.iUrl, payload).subscribe({
      next: (response: any) => {
        // this.currentAnalysis.content = response.data.content;
        // this.result = this.processResult(this.currentAnalysis.content)
        // const correctedData = response.data.content.replace(/'/g, '"');
        const correctedData = response.content.replace(/'/g, '"').replace(/True/g, 'true').replace(/False/g, 'false');
        
        // console.log('Corrected JSON Data:', correctedData);
    
        let dat = JSON.parse(correctedData);
        
        const score = dat.result.score;

        // this.documentStatus = this.docStatus(score.Status);

        this.nerCount = score.NER;
        // this.location = this.locationStatus(score.Location);

        this.personalData = score.Personal;
        this.financialData = score.Financial;
        this.contactData = score.Contact;
        this.medicalData = score.Medical;
        this.ethnicData = score.Ethnic;
        this.biometricData = score.Biometric;
        this.geneticData = score.Genetic;
        this.consentAgreement = this.consentAgreementStatus(score["Consent Agreement"]);
        this.ragScore = score.RAG_Statement;

        // this.checkdata();

        this.result = "Y";

      },
      error: (error:any) => {
        console.error('There was an error!', error);
      }
  });
    this.currentEmail = 'NA';
    this.currentEmailType = 'txt';
  }

  getFileNameWithoutCountry(fileName: string): string {
    const parts = fileName.split(' - ');

    return parts[0];
  }

  formatDate(date: Date): string {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  
    const isToday = date.getDate() === today.getDate() && 
                    date.getMonth() === today.getMonth() && 
                    date.getFullYear() === today.getFullYear();
  
    if (isToday) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    else {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }

  // processResu  lt(result: string): string {
  //   result = result.replace(/\n/g, "<br>");
  //   this.status = this.searchComplianceStatus(result);
  //   this.result = this.cleanComplianceStatus(result);
  //   this.ca_statement = this.searchContractStatus(result);
  //   this.result = this.cleanContractSearch(this.result);
  //   return result;
  // }

  processResult(result: string): string {
    // Decode the string to handle escape characters
    result = JSON.parse('"' + result.replace(/"/g, '\\"') + '"');
    
    const analysis = this.analyzeDocument(result);
    this.status = analysis.status;
    this.ca_statement = analysis.ca_statement;
    return this.formatResult(analysis.cleanedResult);
  }

  formatResult(result: string): string {
    const lines = result.split('\n').filter(line => line.trim() !== '');
    let formattedResult = '<div class="analysis-content">';
    let currentSection = '';
  
    lines.forEach((line, index) => {
      line = line.trim();
      if (line.endsWith(':')) {
        // This is a section header
        if (currentSection) {
          formattedResult += '</ul>';
        }
        currentSection = line;
        formattedResult += `<b>${currentSection}</b><ul>`;
      } else if (line.includes(':')) {
        // This is a key-value pair
        const [key, value] = line.split(':').map(part => part.trim());
        formattedResult += `<li><strong>${key}:</strong> ${value}</li>`;
      } else {
        // This is either a standalone value or part of the previous section
        formattedResult += `<li>${line}</li>`;
      }
    });
  
    if (currentSection) {
      formattedResult += '</ul>';
    }
  
    formattedResult += '</div>';
    return formattedResult;
  }

  searchComplianceStatus(result: string): string {
    const compliantMatch = result.match(/compliant/i);
    const nonCompliantMatch = result.match(/non-compliant/i);
  
    let status = '';
  
    if (compliantMatch) {
      status = 'compliant';
    } else if (nonCompliantMatch) {
      status = 'non-compliant';
    }
  
    return status;
  }

  analyzeDocument(result: string): { status: string, ca_statement: string, cleanedResult: string } {
    let status: string = 'Non-compliant'; // Default status
    let ca_statement: string = '';
    let cleanedResult: string = result;
  
    // Extract status if present
    const statusMatch = result.match(/\{status\}(.*?)\{\/status\}/);
    if (statusMatch) {
      status = statusMatch[1].trim();
      cleanedResult = cleanedResult.replace(statusMatch[0], '');
    }
  
    // Extract CA statement if present
    const caMatch = result.match(/\{ca_statement\}(.*?)\{\/ca_statement\}/s);
    if (caMatch) {
      ca_statement = caMatch[1].trim();
      cleanedResult = cleanedResult.replace(caMatch[0], '');
    }
  
    // Clean up any remaining newlines at the start or end
    cleanedResult = cleanedResult.trim();
  
    return { status, ca_statement, cleanedResult };
  }


  cleanComplianceStatus(result: string): string {
    console.log("Original result:", result);

    const compliantMatch = result.match(/compliant/i);
    const nonCompliantMatch = result.match(/non-compliant/i);
    const contractStatementMatch = result.match(/\{status\}(.*?)\{\/status\}/);

    console.log("Compliant match:", compliantMatch);
    console.log("Non-compliant match:", nonCompliantMatch);
    console.log("Contract statement match:", contractStatementMatch);

    let cleanedResult = result;

    if (compliantMatch) {
        cleanedResult = cleanedResult.replace(/compliant/i, '');
        console.log("After removing compliant:", cleanedResult);
    } else if (nonCompliantMatch) {
        cleanedResult = cleanedResult.replace(/non-compliant/i, '');
        console.log("After removing non-compliant:", cleanedResult);
    }

    if (contractStatementMatch) {
        cleanedResult = cleanedResult.replace(contractStatementMatch[0], '');
        console.log("After removing contract statement:", cleanedResult);
    }

    console.log("Final cleaned result:", cleanedResult);
    return cleanedResult;
}

  searchContractStatus(result: string): string {
    const contractStatementMatch = result.match(/The document does not seem to contain any data consent agreements\n\n|The document does appear to contain data consent agreements\n\n/);
    let contractStatement = '';
  
    if (contractStatementMatch) {
      contractStatement = contractStatementMatch[0];
    }
  
    return contractStatement;
  }

  cleanContractSearch(result: string): string {
    const contractStatementMatch = result.match(/\{ca_statement\}(.*?)\{\/ca_statement\}/s);
    let cleaned_result = result;
  
    if (contractStatementMatch) {
      cleaned_result = result.replace(contractStatementMatch[0], '');
    }
  
    return cleaned_result;
  }
  getStatusClass(status: string): string {
    if (status === 'success') {
      return 'status-success';
    } else if (status === 'error') {
      return 'status-error';
    } else {
      return 'status-default';
    }
  }

  mock(){
    this.currentAnalysis.content = 'sandwich spread ';
    this.currentEmail = 'NA';
    this.currentEmailType = 'txt';
  }

  smock(filePath: string){
    this.currentAnalysis.content = filePath;
    this.currentEmail = 'NA';
    this.currentEmailType = 'txt';
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
    this.currentEmailType = this.mockData[data].fileType;
  }

  isObjectEmpty(obj: any) {
    return Object.keys(obj).length === 0;
  }

  clearAnalysis() {
    this.currentAnalysis = {};
    this.currentEmail = "";
    this.currentEmailType = "";
  }

  startIntro() {
    const intro = introJs();
    intro.setOptions({
      steps: [
        {
          element: '#Downloads',
          intro: 'This is where you will see all the new downloaded documents.'
        },
        {
          element: '#InboxAttachments',
          intro: 'This is where you will see all the new attachments in the received inbox directory.'
        }
      ],
    });
    intro.start();
  }
  toggleWalkthrough() {
    this.startIntro();
  }

  async generatePDFReport() {
    const data: ViolationData = {
      documentStatus: this.documentStatus,
      nerCount: this.nerCount,
      location: this.location,
      personalData: this.personalData,
      financialData: this.financialData,
      contactData: this.contactData,
      medicalData: this.medicalData,
      ethnicData: this.ethnicData,
      biometricData: this.biometricData,
      geneticData: this.geneticData,
      consentAgreement: this.consentAgreement,
      ragScore: this.ragScore
    };
    try {
      await this.reportGenerationService.generatePDF(data);
    }
    catch (error) {
      console.error('Error generating PDF:', error);
    }
  }

  backToDownloads() {
    this.result = '';
  }
}
