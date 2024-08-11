// import { Component } from '@angular/core';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
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

  constructor(private walkthroughService: WalkthroughService,private http: HttpClient) {}


  ngOnInit() {
    // Check if the user has seen the intro before
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

  // onFileSelected(event: any) {
  //   const file: File = event.target.files[0];

  //   if(file) {
  //     this.fileName = file.name;
  //     this.uploadedFileName = file.name;
  //     this.result = '';

  //     const formData = new FormData();
  //     formData.append("file", file);

  //     // const upload$ = this.http.post("http://127.0.0.1:8000/file-upload", formData);

  //     // upload$.subscribe();
  //     this.http.post<any>("http://127.0.0.1:8000/file-upload", formData).subscribe(
  //       (response) => {
  //         console.log("Server Response: ", response);
  //         this.uploadedFileName = response.fileName,
  //         this.result = this.processResult(response.result);
  //       }
  //     )
  //   }
  // }

//   processResult(result: string): string {
//     const analysis = this.analyzeDocument(result);
//     this.status = analysis.status;
//     // this.result = this.cleanComplianceStatus(result);
//     this.ca_statement = analysis.ca_statement;
//     // this.result = this.cleanContractSearch(this.result);

//     // Extract status, ca_statement, and the content in between
//     // const status = this.status;
//     // const ca_statement = this.ca_statement;
//     // const contentBetween = this.result;

//     // console.log("Status:", status);
//     // console.log("Content Between:", contentBetween);
//     // console.log("CA Statement:", ca_statement);
//     let res = analysis.cleanedResult
//     let bulk = res.replace(/\n/g, "<br>");
//     return bulk;
//   }
  
//   analyzeDocument(result: string): { status: string, ca_statement: string, cleanedResult: string } {
//     let status: string = '';
//     let ca_statement: string = '';
//     let cleanedResult: string = result;

//     const compliantMatch = result.match(/Compliant/i);
//     const nonCompliantMatch = result.match(/Non-compliant/i);
//     const contractStatementMatch = result.match(/The document does not seem to contain any data consent agreements\n\n|The document does appear to contain data consent agreements\n\n/);

//     if (compliantMatch && !nonCompliantMatch) {
//         status = 'Compliant';
//         cleanedResult = cleanedResult.replace(/Compliant/i, '');
//     } else if (nonCompliantMatch) {
//         status = 'Non-compliant';
//         cleanedResult = cleanedResult.replace(/Non-compliant/i, '');
//     }

//     if (contractStatementMatch) {
//         ca_statement = contractStatementMatch[0];
//         cleanedResult = cleanedResult.replace(contractStatementMatch[0], '\n\n');
//     }

//     return { status, ca_statement, cleanedResult };
// }

// searchComplianceStatus(result: string): string {
//     const compliantMatch = result.match(/compliant/i);
//     const nonCompliantMatch = result.match(/non-compliant/i);

//     let status = '';

//     if (compliantMatch) {
//         status = 'compliant';
//     } else if (nonCompliantMatch) {
//         status = 'non-compliant';
//     }

//     return status;
// }

// cleanComplianceStatus(result: string): string {
//     console.log("Original result:", result);

//     const compliantMatch = result.match(/compliant/i);
//     const nonCompliantMatch = result.match(/non-compliant/i);
//     const contractStatementMatch = result.match(/\{status\}(.*?)\{\/status\}/);

//     console.log("Compliant match:", compliantMatch);
//     console.log("Non-compliant match:", nonCompliantMatch);
//     console.log("Contract statement match:", contractStatementMatch);

//     let cleanedResult = result;

//     if (compliantMatch) {
//         cleanedResult = cleanedResult.replace(/compliant/i, '');
//         console.log("After removing compliant:", cleanedResult);
//     } else if (nonCompliantMatch) {
//         cleanedResult = cleanedResult.replace(/non-compliant/i, '');
//         console.log("After removing non-compliant:", cleanedResult);
//     }

//     if (contractStatementMatch) {
//         cleanedResult = cleanedResult.replace(contractStatementMatch[0], '');
//         console.log("After removing contract statement:", cleanedResult);
//     }

//     console.log("Final cleaned result:", cleanedResult);
//     return cleanedResult;
// }

// searchContractStatus(result: string): string {
//     const contractStatementMatch = result.match(/The document does not seem to contain any data consent agreements\n\n|The document does appear to contain data consent agreements\n\n/);
//     let contractStatement = '';

//     if (contractStatementMatch) {
//         contractStatement = contractStatementMatch[0];
//     }

//     return contractStatement;
// }

// cleanContractSearch(result: string): string {
//     const contractStatementMatch = result.match(/\{ca_statement\}(.*?)\{\/ca_statement\}/s);
//     let cleaned_result = result;

//     if (contractStatementMatch) {
//         cleaned_result = result.replace(contractStatementMatch[0], '');
//     }

//     return cleaned_result;
// }

// getStatusClass(status: string): string {
//     if (status === 'success') {
//         return 'status-success';
//     } else if (status === 'error') {
//         return 'status-error';
//     } else {
//         return 'status-default';
//     }
//   }
  

//   isObjectEmpty(obj: any) {
//     return Object.keys(obj).length === 0;
//   }

//   // onFileSelected(event:any) {
//   //   const file: File = event.target.files[0];
//   //   if (file) {
//   //     this.uploadedFileName = file.name;
//   //     const reader = new FileReader();
//   //     reader.readAsText(file);
//   //     reader.onload = () => {
//   //       if (reader.result) {
//   //         this.fileContent = reader.result.toString();
//   //       }
//   //     };
//   //   }
//   // }

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
      return "The document does appear to contain data consent agreements";
    }

    return "The document does not seem to contain any data consent agreements";
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

}
