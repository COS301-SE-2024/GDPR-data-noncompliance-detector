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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if(file) {
      this.fileName = file.name;

      const formData = new FormData();
      formData.append("file", file);

    
      this.http.post<any>("http://127.0.0.1:8000/file-upload", formData).subscribe(
        (response) => {
          console.log("Server Response: ", response);
          this.uploadedFileName = response.fileName,
          this.result = this.processResult(response.result);
        }
      )
    }
  }

    processResult(result: string): string {
    const analysis = this.analyzeDocument(result);
    this.status = analysis.status;
    this.ca_statement = analysis.ca_statement;
    return analysis.cleanedResult; 
  }
  
  analyzeDocument(result: string): { status: string, ca_statement: string, cleanedResult: string } {
    let status: string = '';
    let ca_statement: string = '';
    let cleanedResult: string = result;

    const compliantMatch = result.match(/Compliant/i);
    const nonCompliantMatch = result.match(/Non-compliant/i);
    const contractStatementMatch = result.match(/The document does not seem to contain any data consent agreements\n\n|The document does appear to contain data consent agreements\n\n/);

    if (compliantMatch && !nonCompliantMatch) {
        status = 'Compliant';
        cleanedResult = cleanedResult.replace(/Compliant/i, '');
    } else if (nonCompliantMatch) {
        status = 'Non-compliant';
        cleanedResult = cleanedResult.replace(/Non-compliant/i, '');
    }

    if (contractStatementMatch) {
        ca_statement = contractStatementMatch[0];
        cleanedResult = cleanedResult.replace(contractStatementMatch[0], '\n\n');
    }

    return { status, ca_statement, cleanedResult };
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
    const contractStatementMatch = result.match(/\nThe document does not seem to contain any data consent agreements\n\n|The document does appear to contain data consent agreements\n\n/);
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
  

  isObjectEmpty(obj: any) {
    return Object.keys(obj).length === 0;
  }


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

  formatResult(result: string): string {
    return result.split('\n\n').map(section => {
      const lines = section.split('\n');
      const header = `<b>${lines[0]}</b>`;
      const content = lines.slice(1).join('<br>');
      return `${header}<br>${content}`;
    }).join('<br>');
  }

}
