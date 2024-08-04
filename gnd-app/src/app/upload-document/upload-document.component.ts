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
  result: string = ''


  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if(file) {
      this.fileName = file.name;

      const formData = new FormData();
      formData.append("file", file);

      // const upload$ = this.http.post("http://127.0.0.1:8000/file-upload", formData);

      // upload$.subscribe();
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
    result = result.replace(/\n/g, "<br>");
    result = result.replace(/\{status\}(.*?)\{\/status\}/g, '<div class="status" [ngClass]="getStatusClass(\'$1\')">$1</div>')
    result = result.replace(/\{ca_statement\}(.*?)\{\/ca_statement\}/g, '<div class="ca_statement">$1</div>')
    return result
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

  // onFileSelected(event:any) {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     this.uploadedFileName = file.name;
  //     const reader = new FileReader();
  //     reader.readAsText(file);
  //     reader.onload = () => {
  //       if (reader.result) {
  //         this.fileContent = reader.result.toString();
  //       }
  //     };
  //   }
  // }

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

}
