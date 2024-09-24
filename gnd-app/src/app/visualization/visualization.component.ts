import { Component, Input, OnInit, AfterViewInit, ElementRef ,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VisualizationService } from '../services/visualization.service';
// import { BrowserModule } from '@angular/platform-browser';
// import { AppComponent } from './app.component';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ChartComponent,
  NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-visualization',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, NgxEchartsModule],
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})
export class VisualizationComponent implements OnInit, AfterViewInit {

  @Input() data: any;
  @ViewChild('progressCanvas') progressCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('radarChartCanvas') radarChartCanvas!: ElementRef<HTMLCanvasElement>;


  nerCount: number = 5;
  location: string = "";
  personalData: number = 7;
  financialData: number =19;
  contactData: number = 21;
  medicalData: number = 14;
  ethnicData: number = 8;
  biometricData: number = 6;
  geneticData: number = 6;
  rag_count = 0;

  receivedData: any;

  constructor(private router: Router,private visualizationService: VisualizationService) {
    // Register Chart.js components
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.data = this.visualizationService.getData(); // Get data from the service
    if (this.data) {
      // console.log('Data in child component:', this.data.score.Biometric); // Log data only when available
      this.nerCount = this.data.score.NER;
      // this.location = "";
      this.personalData = this.data.score.Personal;
      this.financialData =this.data.score.Financial;
      this.contactData = this.data.score.Contact;
      this.medicalData = this.data.score.Medical;
      this.geneticData = this.data.score.Genetic;
      this.ethnicData = this.data.score.Ethnic;
      this.biometricData = this.data.score.Biometric;
      this.rag_count - this.data.score.lenarts;
      // this.createCircularBarChart();
      console.log(this.geneticData);
    }

    // violation_data = {            
    //   "score": {
    //       "Status": status,
    //       "Location": location_report,
    //       "NER": ner_result_report,
    //       "Personal": reg_result_personal_report,
    //       "Financial": reg_result_financial_report,
    //       "Contact": reg_result_contact_report,
    //       "Consent Agreement": ca_statement_report,
    //       "Genetic": gi_result_report,
    //       "Ethnic": em_result_report,
    //       "Medical": md_result_report,
    //       "Biometric": image_result_report,
    //       "RAG Statement":rag_stat,
    //       "len(arts)":rag_count
    //   }
  
    // const navigation = this.router.getCurrentNavigation();
    // this.receivedData = navigation?.extras.state?.['data'];
    // console.log(navigation?.extras.state?.['data']);
  }

  // ngOnInit() {
  //   const navigation = this.router.getCurrentNavigation();
  //   if (navigation?.extras.state) {
  //     const state = navigation.extras.state as {
  //       nerCount: number,
  //       location: string,
  //       personalData: number,
  //       financialData: number,
  //       contactData: number,
  //       medicalData: number,
  //       ethnicData: number,
  //       biometricData: number
  //     };

  //     this.nerCount = state.nerCount;
  //     this.location = state.location;
  //     this.personalData = state.personalData;
  //     this.financialData = state.financialData;
  //     this.contactData = state.contactData;
  //     this.medicalData = state.medicalData;
  //     this.ethnicData = state.ethnicData;
  //     this.biometricData = state.biometricData;

  //     console.log('Received data:', state);  // Debugging log
  //     this.createCircularBarChart();
  //   }
  //   console.log("Starting point")
  // }

  ngAfterViewInit() {
    // this.drawCircularProgressBar(this.rag_count);
    this.calculateMetric();
  }

  createCircularBarChart() {
    const ctx = document.getElementById('circularBarChart') as HTMLCanvasElement;
    if (ctx) {
      const data = {
        labels: ['NER', 'Personal', 'Financial', 'Contact', 'Medical', 'Ethnic', 'Biometric','Genetic'],
        datasets: [{
          label: 'Scores',
          data: [
            this.nerCount,
            this.personalData,
            this.financialData,
            this.contactData,
            this.medicalData,
            this.ethnicData,
            this.biometricData,
            this.geneticData
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      };

      const options = {
        scales: {
          r: {
            beginAtZero: true
          }
        }
      };

      new Chart(ctx, {
        type: 'polarArea',
        data: data,
        options: options
      });
    } else {
      console.error('No canvas context found');  // Debugging log
    }
  }

  drawCircularProgressBar(value: number) {
    const canvas = this.progressCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context');
      return;
    }

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (2 * Math.PI * (value / 99));

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#e6e6e6';
    ctx.fill();

    // Draw the progress circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#4caf50';
    ctx.stroke();

    // Draw the text
    ctx.font = '20px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${value}/99`, centerX, centerY);
  }

  calculateMetric() {

    const w_per = 1;
    const w_med = 0.2;
    const w_gen = 0.1;
    const w_eth = 0.2;
    const w_bio = 0.6;

    let e_personalData  = (Math.exp(this.data.score.Personal) + Math.exp(this.financialData) + Math.exp(this.contactData))*w_per;
    let e_med = Math.exp(this.medicalData)*w_med;
    let e_gen = Math.exp(this.geneticData)*w_gen;
    let e_eth = Math.exp(this.ethnicData)*w_eth;
    let e_bio = Math.exp(this.biometricData)*w_bio;

    const expValues = [e_personalData, e_med, e_gen, e_eth, e_bio];

    let maxExpValue = expValues[0];

    for (let i = 1; i < expValues.length; i++) {
      if (expValues[i] > maxExpValue) {
        maxExpValue = expValues[i];
      }
    }

    let N_e_personalData = e_personalData/maxExpValue;
    let N_e_med = e_med/maxExpValue;
    let N_e_gen = e_gen/maxExpValue;
    let N_e_eth = e_eth/maxExpValue;
    let N_e_bio = e_bio / maxExpValue;
    
    this.createRadarChart([N_e_personalData, N_e_med, N_e_gen, N_e_eth, N_e_bio]);

  }
 
  createRadarChart(data: number[]) {
    const canvas = this.radarChartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context');
      return;
    }

    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Personal', 'Medical', 'Genetic', 'Ethnic', 'Biometric'],
        datasets: [{
          label: 'Normalized Data',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 1
          }
        }
      }
    });
  }
}