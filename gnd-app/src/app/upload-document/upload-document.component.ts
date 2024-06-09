import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';


@Component({
  selector: 'app-upload-document',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-document.component.html',
  styleUrl: './upload-document.component.css'
})
export class UploadDocumentComponent {


  currentAnalysis: any = {};



  isObjectEmpty(obj: any) {
    return Object.keys(obj).length === 0;
  }

  onFileSelected(event:any) {
  const file = event.target.files[0];
  console.log(file);
}
}
