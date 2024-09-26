import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as introJs from 'intro.js/intro.js';
import {WalkthroughService} from '../services/walkthrough.service';
import {Subscription} from "rxjs";
import { VisualizationComponent } from "../visualization/visualization.component";
import { VisualizationService } from '../services/visualization.service';

@Component({
  selector: 'app-upload-document',
  standalone: true,
  imports: [CommonModule, RouterModule, VisualizationComponent],
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.css']
})
export class UploadDocumentComponent implements OnInit{
  private walkthroughSubscription?: Subscription;
  response: any;
  bar_plot: any;

  constructor(private walkthroughService: WalkthroughService,private http: HttpClient, private router: Router, private visualizationService: VisualizationService,) {}


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
  genetic_data: number = 0;
  metric_score: number = 0;


  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if(file) {
      this.fileName = file.name;
      console.log("File Name: ", this.fileName);
      this.uploadedFileName = file.name;
      console.log("Uploaded File Name: ", this.uploadedFileName);
      this.result = '';

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);

      // const upload$ = this.http.post("http://127.0.0.1:8000/file-upload", formData);

      // upload$.subscribe();
      this.http.post<any>("http://127.0.0.1:8000/file-upload-new", formData).subscribe(
        (response) => {
          // console.log("Server Response: ", response);
          this.uploadedFileName = response.fileName;
          // this.result = this.processResult(response.result);
          // console.log(response.result.score.Biometric)
          this.fileName = response.fileName;          console.log(response)

          this.documentStatus = this.docStatus(response.result.score.Status);
          this.nerCount = response.result.score.NER;
          this.location = this.locationStatus(response.result.score.Location);
          this.personalData = response.result.score.Personal;
          this.financialData = response.result.score.Financial;
          this.contactData = response.result.score.Contact;
          this.medicalData = response.result.score.Medical;
          this.ethnicData = response.result.score.Ethnic;
          this.biometricData = response.result.score.Biometric;
          this.genetic_data = response.result.score.Genetic;
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
    if (this.response) {
      this.visualizationService.setData(this.response);
      this.router.navigate(['/visualization']);
    }
  }

  calculateMetric() {

    const w_per = 1;
    const w_med = 0.4;
    const w_gen = 0.2;
    const w_eth = 0.4;
    const w_bio = 0.8;

    let e_personalData = (Math.exp(this.nerCount) + Math.exp(this.financialData) + Math.exp(this.contactData)) + Math.exp(this.personalData);
    let e_med = Math.exp(this.medicalData);
    // let e_gen = Math.exp(this.geneticData)*w_gen;
    let e_gen = Math.exp(this.genetic_data);
    let e_eth = Math.exp(this.ethnicData);
    let e_bio = Math.exp(this.biometricData);


    const expValues = [e_personalData, e_med, e_gen, e_eth, e_bio];

    let maxExpValue = expValues[0];

    for (let i = 1; i < expValues.length; i++) {
      if (expValues[i] > maxExpValue) {
        maxExpValue = expValues[i];
      }
    }

    let N_e_personalData = (e_personalData / maxExpValue) * w_per;
    let N_e_med = (e_med / maxExpValue) * w_med;
    let N_e_gen = (e_gen / maxExpValue) * w_gen;
    let N_e_eth = (e_eth / maxExpValue) * w_eth;
    let N_e_bio = (e_bio / maxExpValue) * w_bio;

    this.metric_score = N_e_personalData + N_e_med + N_e_gen + N_e_eth + N_e_bio;
  }
}
