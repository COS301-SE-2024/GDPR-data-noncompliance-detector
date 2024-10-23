import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

type DataTypeName = 'Personal Data' | 'Financial Data' | 'Contact Data' | 'Medical Data' | 'Biometric Data' | 'Ethnic Data' | 'Genetic Data';

export interface ViolationData {
  documentStatus: string;
  nerCount: number;
  location: string;
  personalData: number;
  financialData: number;
  contactData: number;
  medicalData: number;
  ethnicData: number;
  biometricData: number;
  geneticData: number;
  consentAgreement: string;
  ragScore: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportGenerationService {

  private logoDataUrl: string | null = null;
  private iconDataUrl: string | null = null;
  private fontLoaded: boolean = false;

  constructor(private http: HttpClient) { }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private getImageDataUrl(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            resolve(dataURL);
          } else {
            reject('Canvas context is null.');
          }
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = (err) => {
        console.error(`Failed to load image at ${imageUrl}:`, err);
        reject(`Failed to load image at ${imageUrl}`);
      };
    });
  }

  private async loadImages(): Promise<void> {
    try {
      if (!this.logoDataUrl) {
        this.logoDataUrl = await this.getImageDataUrl('assets/GND_LogoBG.png');
        console.log('Logo image loaded successfully.');
      }
      if (!this.iconDataUrl) {
        this.iconDataUrl = await this.getImageDataUrl('assets/circle-question-regular.jpg');
        console.log('Icon image loaded successfully.');
      }
    } catch (error) {
      console.error('Error loading images:', error);
      throw new Error('Failed to load images.');
    }
  }

  private async loadCustomFont(doc: jsPDF): Promise<void> {
    try {
      const fontUrl = 'assets/fonts/MediatorNarrowWebExtraBold.ttf';
      const fontArrayBuffer = await firstValueFrom(
        this.http.get(fontUrl, { responseType: 'arraybuffer' })
      );

      // Convert font to Base64
      const fontBase64 = this.arrayBufferToBase64(fontArrayBuffer);

      // Need to register font with jsPDF
      doc.addFileToVFS('MediatorNarrowWebExtraBold.ttf', fontBase64);
      doc.addFont('MediatorNarrowWebExtraBold.ttf', 'MediatorNarrowExtraBold', 'normal');

      console.log('Custom font loaded and registered successfully.');
    } catch (error) {
      console.error('Error loading custom font:', error);
      throw new Error('Failed to load custom font.');
    }
  }

  private getNerText(nerCount: number): string {
    if (nerCount === 0) {
      return 'The document potentially references no individuals.';
    }
    else if (nerCount === 1) {
      return 'The document potentially references 1 individual.';
    }
    else {
      return `The document potentially references ${nerCount} different individuals.`;
    }
  }

  async generatePDF(data: ViolationData): Promise<void> {
    console.log('data.ragScore:', data.ragScore, 'Type:', typeof data.ragScore);

    try {
      await this.loadImages();
      console.log("TEST: " + data.ragScore);
      const doc = new jsPDF('p', 'mm', 'a4');
  
      await this.loadCustomFont(doc);
  
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
  
      // Header
      doc.setFillColor('#111827');
      doc.rect(0, 0, pageWidth, 31, 'F');
  
      doc.setTextColor('#F5F5F5');
      doc.setFontSize(24);
      doc.setFont('MediatorNarrowExtraBold', 'normal');
      doc.text('GND', 20, 12);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Phone: 068 590 1787', 20, 20);
      doc.text('Email: aprilfour301@gmail.com', 20, 26);
  
      // Logo
      const logoWidth = 30;
      const logoHeight = 28;
      const logoX = pageWidth - logoWidth - 25;
      const logoY = 2;
      if (this.logoDataUrl) {
        doc.addImage(this.logoDataUrl, 'JPEG', logoX, logoY, logoWidth, logoHeight);
      } else {
        console.warn('Logo image not loaded.');
      }
  
      // Title
      doc.setTextColor(0, 0, 0);
      doc.setFont('MediatorNarrowExtraBold', 'normal');
      doc.setFontSize(28);
      doc.text('GDPR Violations Report', pageWidth / 2, 45, { align: 'center' });
  
      let yPosition = 60;
  
      // Compliance Status
      yPosition += 0;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      if (data.documentStatus === 'Compliant') {
        doc.setTextColor(0, 128, 0);
      } else if (data.documentStatus === 'Non-Compliant') {
        doc.setTextColor(255, 0, 0);
      } else {
        doc.setTextColor(0, 0, 0);
      }
      doc.text(data.documentStatus, pageWidth / 2, yPosition, { align: 'center' });
  
      doc.setTextColor(0, 0, 0);
  
      // yPosition += 15;
      // doc.setFont('helvetica', 'normal');
      // doc.setFontSize(14);
      // const nerText = this.getNerText(data.nerCount);
      // doc.text(nerText, 22, yPosition);
    
      // // Divider
      // yPosition += 5;
      // doc.setDrawColor(128, 128, 128);
      // doc.setLineWidth(0.2);
      // doc.line(20, yPosition, pageWidth - 20, yPosition);

      yPosition += 15;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Valid Consent Agreement:', 22, yPosition);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(String(data.consentAgreement), pageWidth - 22, yPosition, { align: 'right' });

      yPosition += 5;

      // Draw divider
      doc.setDrawColor(128, 128, 128);
      doc.setLineWidth(0.2);
      doc.line(20, yPosition, pageWidth - 20, yPosition);

      //Data
      const descriptions: Record<DataTypeName, string> = {
        "Personal Data": "This may include personal data such as names, identification number, dates of birth etc.",
        "Financial Data": "This may include personal financial data such as banking details, tax numbers, account details etc.",
        "Contact Data": "This may include personal contact details such as phone numbers, email addresses and social media.",
        "Medical Data": "This may include personal medical data such as chronic illnesses, past injuries, diseases etc.",
        "Biometric Data": "This may include biometric data such as fingerprints, facial recognition, iris scans etc.",
        "Ethnic Data": "This may include ethnic data such as racial or ethnic origin, nationality, language etc.",
        "Genetic Data": "This may include genetic data such as ethic history, gene variants and hereditary traits etc."
      };
  
      // Data Types
      const dataTypes: { name: DataTypeName; value: number }[] = [
        { name: 'Personal Data', value: data.personalData },
        { name: 'Financial Data', value: data.financialData },
        { name: 'Contact Data', value: data.contactData },
        { name: 'Medical Data', value: data.medicalData },
        { name: 'Ethnic Data', value: data.ethnicData },
        { name: 'Biometric Data', value: data.biometricData },
        { name: 'Genetic Data', value: data.geneticData }
      ];

      // yPosition += 15;

      const iconWidth = 3;
      const iconHeight = 3;

  
      for (const dataType of dataTypes) {
        yPosition += 10;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`${dataType.name}:`, 22, yPosition);
  
        doc.setFont('helvetica', 'normal');
        doc.text(`${dataType.value} issues`, pageWidth - 22, yPosition, { align: 'right' });

        doc.setTextColor(128, 128, 128);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        const description = descriptions[dataType.name];
        
        if (this.iconDataUrl) {
          doc.addImage(this.iconDataUrl, 'JPEG', 25 - iconWidth, yPosition + 4.3, iconWidth, iconHeight);
        } 
        
        else {
          console.warn('Icon image not loaded.');
        }
        doc.text(description, 27, yPosition + 7);
  
        yPosition += 12;
  
        doc.setDrawColor(128, 128, 128);
        doc.setLineWidth(0.2);
        doc.line(20, yPosition, pageWidth - 20, yPosition);
      }

      yPosition += 10;
    
      // GDPR Articles Violated
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('GDPR Articles Violated:', 22, yPosition);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      const articles = data.ragScore;

      if (Array.isArray(articles) && articles.length > 0) {
        for (const article of articles) {
          doc.text(`Article ${article}`,pageWidth - 35, yPosition, { align: 'left' });
          yPosition += 6;
        }
      } else {
        doc.text('None', 22, yPosition);
        yPosition += 6;
      }

      doc.setTextColor(0, 0, 0);
    
      // Footer rectangle
      doc.setFillColor('#111827');
      doc.rect(0, pageHeight - 8, pageWidth, 10, 'F');
  
      doc.save('GND Violations Report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again');
    }
  }
}