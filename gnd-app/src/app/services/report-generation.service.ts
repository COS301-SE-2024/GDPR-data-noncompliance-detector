import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

type DataTypeName = 'General Personal' | 'Financial' | 'Contact' | 'Medical' | 'Biometric' | 'Ethnic' | 'Genetic';

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
        this.logoDataUrl = await this.getImageDataUrl('assets/GND_LSG.jpg');
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
    try {
      await this.loadImages();

      const doc = new jsPDF('p', 'mm', 'a4');

      await this.loadCustomFont(doc);

      doc.setFont('MediatorNarrowExtraBold', 'normal');

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();


      // Header Stuff
      doc.setFillColor('#20B2AA');
      doc.rect(0, 0, pageWidth, 40, 'F');

      doc.setTextColor('#F5F5F5');
      doc.setFontSize(24);
      doc.text('GND', 20, 15);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Phone: 068 590 1787', 20, 25);
      doc.text('Email: aprilfour301@gmail.com', 20, 32);

      // Logo
      const logoWidth = 35;
      const logoHeight = 30;
      const logoX = pageWidth - logoWidth - 25;
      const logoY = 5;
      if (this.logoDataUrl) {
        doc.addImage(this.logoDataUrl, 'JPEG', logoX, logoY, logoWidth, logoHeight);
      }
      
      else {
        console.warn('Logo image not loaded.');
      }

      //GDPR violations report
      doc.setTextColor(0, 0, 0);
      doc.setFont('MediatorNarrowExtraBold', 'normal');
      doc.setFontSize(28);
      doc.text('GDPR Violations Report', pageWidth / 2, 55, { align: 'center' });

      const rectFillColor = data.documentStatus === 'Compliant' ? 'green' : 'red';      //Comp rectangle
      const rectText = data.documentStatus === 'Compliant'
        ? 'This document does not appear to contain GDPR violations'
        : 'This document may contain GDPR violations';
      
      doc.setFillColor(rectFillColor);
      doc.setDrawColor('#000000');
      
      doc.setLineWidth(0.5);
      
      const rectWidth = data.documentStatus === 'Compliant' ? 120 : 100;
      const rectHeight = 10;
      const rectX = (pageWidth - rectWidth) / 2;
      const rectY = 65;
      
      doc.roundedRect(rectX, rectY, rectWidth, rectHeight, 2, 2, 'FD');
      
      doc.setTextColor('#F5F5F5');
      doc.setFontSize(12);
      const textWidth = doc.getTextWidth(rectText);
      const textX = rectX + (rectWidth - textWidth) / 2;
      const textY = rectY + rectHeight / 3 + 3;
      doc.text(rectText, textX, textY);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('MediatorNarrowExtraBold', 'normal');
      let yPosition = 85;
      const nerText = this.getNerText(data.nerCount);
      doc.text(nerText, 22, yPosition);

      //Data
      const descriptions: Record<DataTypeName, string> = {
        "General Personal": "This may include personal data such as names, identification number, dates of birth etc.",
        "Financial": "This may include personal financial data such as banking details, tax numbers, account details etc.",
        "Contact": "This may include personal contact details such as phone numbers, email addresses and social media.",
        "Medical": "This may include personal medical data such as chronic illnesses, past injuries, diseases etc.",
        "Biometric": "This may include biometric data such as fingerprints, facial recognition, iris scans etc.",
        "Ethnic": "This may include ethnic data such as racial or ethnic origin, nationality, language etc.",
        "Genetic": "This may include genetic data such as ethic history, gene variants and hereditary traits etc."
      };

      const dataTypes: { name: DataTypeName; value: number }[] = [
        { name: 'General Personal', value: data.personalData },
        { name: 'Financial', value: data.financialData },
        { name: 'Contact', value: data.contactData },
        { name: 'Medical', value: data.medicalData },
        { name: 'Ethnic', value: data.ethnicData },
        { name: 'Biometric', value: data.biometricData },
        { name: 'Genetic', value: data.geneticData }
      ];

      yPosition += 15;

      const iconWidth = 3;
      const iconHeight = 3;

      for (const dataType of dataTypes) {
        doc.setTextColor(0, 0, 0);
        doc.setFont('MediatorNarrowExtraBold', 'normal');
        doc.setFontSize(18);
        doc.text(`${dataType.name} Data`, 22, yPosition);
        doc.text(String(dataType.value), pageWidth - 22, yPosition, { align: 'right' });

        doc.setTextColor(128, 128, 128);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        const description = descriptions[dataType.name];
        
        if (this.iconDataUrl) {
          doc.addImage(this.iconDataUrl, 'JPEG', 23 - iconWidth, yPosition + 4.3, iconWidth, iconHeight);
        } 
        
        else {
          console.warn('Icon image not loaded.');
        }
        doc.text(description, 25, yPosition + 7);

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.2);
        doc.line(20, yPosition + 10, pageWidth - 20, yPosition + 10);

        yPosition += 25;
      }

      //CA rectangle
      const consentRectWidth = 150;
      const consentRectHeight = 10;
      const consentRectY = pageHeight - 28;
      const consentRectX = (pageWidth - consentRectWidth) / 2;

      doc.setFillColor('#0875e2');
      doc.setDrawColor('#000000');
      doc.setLineWidth(0.5);
      doc.roundedRect(consentRectX, consentRectY, consentRectWidth, consentRectHeight, 2, 2, 'FD');


      doc.setTextColor('#FFFFFF');
      doc.setFont('MediatorNarrowExtraBold', 'normal');
      doc.setFontSize(12);

      const consentTextWidth = doc.getTextWidth(data.consentAgreement);
      const consentTextX = consentRectX + (consentRectWidth - consentTextWidth) / 2;
      const consentTextY = consentRectY + consentRectHeight / 3 + 3;

      doc.text(data.consentAgreement, consentTextX, consentTextY);

      // Footer
      doc.setFillColor('#20B2AA');
      doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');

      doc.save('GND Violations Report.pdf');
    }
    
    catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please check the console for more details.');
    }
  }
}
