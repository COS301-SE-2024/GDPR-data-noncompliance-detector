import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as introJs from 'intro.js/intro.js';
import {WalkthroughService} from '../services/walkthrough.service';
import {Subscription} from "rxjs";
import { VisualizationComponent } from "../visualization/visualization.component";
import { VisualizationService } from '../services/visualization.service';
import * as CryptoJS from 'crypto-js';
import { mode } from 'crypto-js';
import 'crypto-js/mode-ctr';

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
  uploadState: any;
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
  ragScore: string = "";
  metric_score: number = 0;
  isUploading: boolean = false;
  encryption_key = 'IWIllreplacethislaterIWIllreplac';
  personal: number = 0;

  constructor(private walkthroughService: WalkthroughService, private http: HttpClient, private router: Router, private visualizationService: VisualizationService,) { }

  ngOnInit() {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (!hasSeenIntro) {
      this.startIntro();
      localStorage.setItem('hasSeenIntro', 'true');
    }
    this.walkthroughSubscription = this.walkthroughService.walkthroughRequested$.subscribe(()=>{
      this.startIntro();
    })
    this.uploadState = this.visualizationService.getUploadState();
    console.log("------------------------------------------------------------");
    console.log(this.uploadState);
    if (this.uploadState) {
      this.response = this.uploadState;
      this.uploadedFileName = this.uploadState.fileName;
          // this.result = this.processResult(response.result);
          // console.log(response.result.score.Biometric)

          this.documentStatus = this.docStatus(this.uploadState.score.Status);
          this.nerCount = this.uploadState.score.NER;
          this.location = this.locationStatus(this.uploadState.score.location);
          this.personalData = this.uploadState.score.Personal;
          this.financialData = this.uploadState.score.Financial;
          this.contactData = this.uploadState.score.Contact;
          this.medicalData = this.uploadState.score.Medical;
          this.ethnicData = this.uploadState.score.Ethnic;
          this.biometricData = this.uploadState.score.Biometric;
          this.genetic_data = this.uploadState.score.Genetic;
          this.consentAgreement = this.consentAgreementStatus(this.uploadState.score["Consent Agreement"]);
          this.response = this.uploadState.result;
          console.log(this.nerCount);
          this.checkdata();
      this.personal = this.nerCount + this.personalData + this.financialData + this.contactData;
          this.result = "Y";
          this.visualizationService.setUploadState(this.response.result);
    }
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
  pdf_data: string = '';

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      const file = event.dataTransfer.files[0];
      console.log("File Dropped:", file);

      
      if (file) {                                                     //Uses same logic as onFileSelected - API access etc..
        this.fileName = file.name;
        console.log("File Name: ", this.fileName);
        this.uploadedFileName = file.name;
        console.log("Uploaded File Name: ", this.uploadedFileName);
        this.result = '';
        this.isUploading = true;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);

        this.http.post<any>("http://127.0.0.1:8000/file-upload-new", formData).subscribe(
          (response) => {
            try {
              const encryptedData = CryptoJS.enc.Base64.parse(response.result);

              // Separate IV (first 16 bytes) and ciphertext (remaining bytes)
              const iv = CryptoJS.lib.WordArray.create(encryptedData.words.slice(0, 4));
              const ciphertext = CryptoJS.lib.WordArray.create(encryptedData.words.slice(4));
    
              // Decrypt using CryptoJS, ensuring padding and mode are the same as in Python
              const decryptedBytes = CryptoJS.AES.decrypt(
                CryptoJS.lib.CipherParams.create({ ciphertext: ciphertext }),
                CryptoJS.enc.Utf8.parse(this.encryption_key),
                {
                  iv: iv,
                  mode: CryptoJS.mode.CBC,
                  padding: CryptoJS.pad.Pkcs7
                }
              );
    
              // Convert decrypted bytes to a UTF-8 string
              const decryptedResult = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
              // Parse the decrypted result as JSON
              const res = JSON.parse(decryptedResult);

              this.uploadedFileName = res.fileName;
              this.fileName = res.fileName;
              console.log(res);

              // Process the result data as before
              this.documentStatus = this.docStatus(res.score.Status);
              this.nerCount = res.score.NER;
              this.location = this.locationStatus(res.score.Location);
              this.personalData = res.score.Personal;
              this.financialData = res.score.Financial;
              this.contactData = res.score.Contact;
              this.medicalData = res.score.Medical;
              this.ethnicData = res.score.Ethnic;
              this.biometricData = res.score.Biometric;
              this.genetic_data = res.score.Genetic;
              this.consentAgreement = this.consentAgreementStatus(res.score["Consent Agreement"]);
              this.ragScore = res.score.RAG_Statement;
              this.response = res;

              console.log(this.nerCount);
              this.checkdata();
              this.result = "Y";
              this.isUploading = false;

            } catch (error) {
              console.error("Decryption failed:", error);
              this.isUploading = false;
            }
          },
          (error) => {
            console.error("Upload failed:", error);
            this.isUploading = false;
            this.clearAnalysis();
            alert("Cannot process File. Please try again.\nEnsure the file type meets the required format.");
          }
        );
      }
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
  
    if (file) {
      this.fileName = file.name;
      console.log("File Name: ", this.fileName);
      this.uploadedFileName = file.name;
      console.log("Uploaded File Name: ", this.uploadedFileName);
      this.result = '';
      this.isUploading = true;
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);

      this.http.post<any>("http://127.0.0.1:8000/file-upload-new", formData).subscribe(
      (response) => {
              try {
                const encryptedData = CryptoJS.enc.Base64.parse(response.result);

                // Separate IV (first 16 bytes) and ciphertext (remaining bytes)
                const iv = CryptoJS.lib.WordArray.create(encryptedData.words.slice(0, 4));
                const ciphertext = CryptoJS.lib.WordArray.create(encryptedData.words.slice(4));
      
                // Decrypt using CryptoJS, ensuring padding and mode are the same as in Python
                const decryptedBytes = CryptoJS.AES.decrypt(
                  CryptoJS.lib.CipherParams.create({ ciphertext: ciphertext }),
                  CryptoJS.enc.Utf8.parse(this.encryption_key),
                  {
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                  }
                );
      
                // Convert decrypted bytes to a UTF-8 string
                const decryptedResult = decryptedBytes.toString(CryptoJS.enc.Utf8);
      
                // Parse the decrypted result as JSON
                const res = JSON.parse(decryptedResult);

                this.uploadedFileName = res.fileName;
                this.fileName = res.fileName;
                console.log(res);

                // Process the result data as before
                this.documentStatus = this.docStatus(res.score.Status);
                this.nerCount = res.score.NER;
                this.location = this.locationStatus(res.score.Location);
                this.personalData = res.score.Personal;
                this.financialData = res.score.Financial;
                this.contactData = res.score.Contact;
                this.medicalData = res.score.Medical;
                this.ethnicData = res.score.Ethnic;
                this.biometricData = res.score.Biometric;
                this.genetic_data = res.score.Genetic;
                this.consentAgreement = this.consentAgreementStatus(res.score["Consent Agreement"]);
                this.ragScore = res.score.RAG_Statement;
                this.response = res;

                console.log(this.nerCount);
                this.checkdata();
                this.result = "Y";
                this.isUploading = false;

              } catch (error) {
                console.error("Decryption failed:", error);
                this.isUploading = false;
              }
            },
            (error) => {
              console.error("Upload failed:", error);
              this.isUploading = false;
            }
          );
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
    if(location == 1 ) {
      return "Not EU"
    }

    else if(location == 0) {
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
    this.visualizationService.setUploadState(this.response);
    if (this.response) {
      this.visualizationService.setData(this.response);
      this.router.navigate(['/visualization']);
    }
    else {
      if (this.uploadState) {
        this.visualizationService.setData(this.uploadState);
        this.router.navigate(['/visualization']);
      }
    }
  }

  calculateMetric() {

    const w_per = 1;
    const w_med = 0.4;
    const w_gen = 0.2;
    const w_eth = 0.4;
    const w_bio = 2;

    let e_personalData  = Math.exp(this.personal + this.financialData + this.contactData + this.personalData);
    let e_med = Math.exp(this.medicalData);
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

    let N_e_personalData = (e_personalData/maxExpValue)*w_per;
    let N_e_med = (e_med/maxExpValue)*w_med;
    let N_e_gen = (e_gen/maxExpValue)*w_gen;
    let N_e_eth = (e_eth/maxExpValue)*w_eth;
    let N_e_bio = (e_bio / maxExpValue)*w_bio;
    
  }

  onAnnotate() {
    this.visualizationService.setPDFState(this.pdf_data);
    console.log(this.pdf_data);
    this.visualizationService.setUploadState(this.response);
    if (this.response) {
      this.visualizationService.setPDFState(this.pdf_data);
      this.visualizationService.setUploadState(this.response);
      this.router.navigate(['/annotate']);
    }
  }

  clearAnalysis() {
    this.response = null;
    this.bar_plot = null;
    this.uploadState = null;
    this.documentStatus = "";
    this.nerCount = 0;
    this.location = "";
    this.personalData = 0;
    this.financialData = 0;
    this.contactData = 0;
    this.medicalData = 0;
    this.ethnicData = 0;
    this.biometricData = 0;
    this.consentAgreement = "";
    this.genetic_data = 0;
    this.ragScore = "";
    this.metric_score = 0;
    this.isUploading = false;
    this.fileName = '';
    this.uploadedFileName = '';
    this.fileContent = '';
    this.styledReportContent = '';
    this.result = '';

    const fileInput = document.getElementById('dropzone-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    this.visualizationService.setUploadState(null);
    this.visualizationService.setData(null);
    this.visualizationService.setPDFState(null);
  }

}
