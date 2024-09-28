import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  slides = [
    {
      title: 'GND User Manual',
      description: '1. Click on the "Upload a File" button',
      image: 'assets/images/Help/Upload page.png',
    },
    {
      title: 'Submitting a File',
      description: '2. Click on the "Upload a File" pane',
      image: 'assets/images/Help/uploadaFilePage.png',
    },
    {
      title: 'Uploading a File',
      description: '3. Click "Press here to upload a file" icon',
      image: 'assets/images/Help/HowToUpload.png',
    },
    {
      title: 'Selecting the File',
      description: '4. Select the file you want to upload',
      image: 'assets/images/Help/UploadFileDialogue.png',
    },
    {
      title: 'Confirming the Upload',
      description: '5. Click on the "Open" button after selecting a file',
      image: 'assets/images/Help/ClickaFile.png',
    },
    {
      title: 'Analysis Result',
      description: '6. The uploaded file\'s analysis',
      image: 'assets/images/Help/AnalysisOfFile.png',
    },
    {
      title: 'Inbox Overview',
      description: '7. After you click the inbox button',
      image: 'assets/images/Help/inboxPage.png',
    },
    {
      title: 'FAQ Page',
      description: '8. View frequently asked questions',
      image: 'assets/images/Help/FAQ.png',
    },
  ];

  currentSlide = 0;

  constructor() {}

  ngOnInit(): void {}

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }
}