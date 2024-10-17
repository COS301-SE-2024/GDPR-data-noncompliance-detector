import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VisualizationService } from '../services/visualization.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-annotation',
  standalone: true,
  imports: [],
  templateUrl: './annotation.component.html',
  styleUrl: './annotation.component.css'
})
export class AnnotationComponent implements OnInit{
  encoded_value: string = '';
  pdfUrl: SafeResourceUrl | undefined;
  receivedData: any;

  constructor(private sanitizer: DomSanitizer, private visualizationService: VisualizationService,private router:Router) {
    
  }

  ngOnInit(): void {
    // console.log(this.visualizationService.getUploadState());
    // this.receivedData = this.visualizationService.getUploadState();
    this.encoded_value = this.receivedData.score.ner_result_text;
    const base64Pdf = this.encoded_value; 
    const byteCharacters = atob(base64Pdf);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Create a URL for the Blob and sanitize it
    const url = URL.createObjectURL(blob);
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onBack() {
    this.router.navigate(['/upload']);
  }
}
