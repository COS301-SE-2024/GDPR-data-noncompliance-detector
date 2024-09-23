import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as introJs from 'intro.js/intro.js';
import {WalkthroughService} from '../services/walkthrough.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-upload-document',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.css']
})
export class UploadDocumentComponent implements OnInit{
  private walkthroughSubscription?: Subscription;
  response: any;

  constructor(private walkthroughService: WalkthroughService,private http: HttpClient, private router: Router) {}


  ngOnInit() {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (!hasSeenIntro) {
      this.startIntro();
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

  startIntro() {
    const intro = introJs();
    intro.setOptions({
      steps: [
        {
          element: '#uploadFile',
          intro: 'Click here to upload a document'
        },
        {
          element: '#Report',
          intro: 'This where the report shows after the upload'
        }
      ],
    });
    intro.start();
  }
  toggleWalkthrough() {
    this.startIntro();
  }

  isDragActive: boolean = false;
  currentAnalysis: any = {};
  uploadedFileName: string = '';
  fileContent: string = '';
  styledReportContent: string = '';
  fileName = '';
  result: string = '';
  status: string = '';
  ca_statement: string = '';

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      const file = event.dataTransfer.files[0];
      console.log(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.isDragActive = true;
  }

  onDragLeave(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.isDragActive = false;
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



  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if(file) {
      this.fileName = file.name;
      this.uploadedFileName = file.name;
      this.result = '';

      const formData = new FormData();
      formData.append("file", file);

      // const upload$ = this.http.post("http://127.0.0.1:8000/file-upload", formData);

      // upload$.subscribe();
      this.http.post<any>("http://127.0.0.1:8000/file-upload-new", formData).subscribe(
        (response) => {
          // console.log("Server Response: ", response);
          this.uploadedFileName = response.fileName;
          // this.result = this.processResult(response.result);
          // console.log(response.result.score.Biometric)

          this.documentStatus = this.docStatus(response.result.score.Status);
          this.nerCount = response.result.score.NER;
          this.location = this.locationStatus(response.result.score.location);
          this.personalData = response.result.score.Personal;
          this.financialData = response.result.score.Financial;
          this.contactData = response.result.score.Contact;
          this.medicalData = response.result.score.Medical;
          this.ethnicData = response.result.score.Ethnic;
          this.biometricData = response.result.score.Biometric;
          this.consentAgreement = this.consentAgreementStatus(response.result.score["Consent Agreement"]);
          this.response = response.result;

          console.log(this.nerCount);
          this.checkdata();

          this.result = "Y";
        }
      )
    }
  }

  checkdata() {
    if(this.nerCount > 0)
      console.log("Yes")
    else
      console.log("No")
  }

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
      return "This document does appear to contain data consent agreements";
    }

    return "This document does not seem to contain any data consent agreements";
  }

  onDownload() {
    const reportUrl = 'http://127.0.0.1:8000/get-report';

    this.http.get(reportUrl, { responseType: 'blob' }).subscribe(blob => {
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = 'GND_violation_report.pdf';
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, error => {
      console.error('Download failed', error);
    });
  }

  onVisualize() {
    this.router.navigate(['/visualization'], { state: { responseData: this.response } });
  }

}
