import { Component, Input, OnInit, AfterViewInit, ElementRef ,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VisualizationService } from '../services/visualization.service';
// import { BrowserModule } from '@angular/platform-browser';
// import { AppComponent } from './app.component';
import 'chartjs-chart-geo';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import {ApexAxisChartSeries,  ApexChart,  ApexXAxis,  ChartComponent,  NgApexchartsModule
} from "ng-apexcharts";
import { Subscription } from 'rxjs';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
};
import { ChoroplethController, GeoFeature , ProjectionScale, ColorScale } from 'chartjs-chart-geo';

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
  @ViewChild('mapCanvas') mapCanvas!: ElementRef<HTMLCanvasElement>;

  scanDataSubscription: Subscription;
  scanData: any;

  nerCount: number = 5;
  location: number = 2;
  personalData: number = 7;
  financialData: number =19;
  contactData: number = 21;
  medicalData: number = 14;
  ethnicData: number = 8;
  biometricData: number = 6;
  geneticData: number = 6;
  rag_count = 0;
  rag_stat: string = "";

  receivedData: any;

  constructor(private router: Router, private scanDataService: VisualizationService) {
    Chart.register(...registerables, ChoroplethController, GeoFeature, ProjectionScale, ColorScale);
    this.scanDataSubscription = new Subscription();
    this.scanData = null;
  }

  ngOnInit() {
    this.scanDataSubscription = this.scanDataService.getScanData().subscribe(data => {
      console.log('VisualizationComponent: Received scan data:', data);
      if (data) {
        this.scanData = data;
      } else {
        console.log('VisualizationComponent: No scan data received.');
      }
    });

    if (this.scanData) {
      console.log('Data in child component:', this.scanData); // Log data only when available
      this.nerCount = this.scanData.NER;
      console.log("Hello: " + this.scanData.nerCount);
      this.location = this.scanData.location_report;
      this.personalData = this.scanData.Personal;
      this.financialData =this.scanData.Financial;
      this.contactData = this.scanData.Contact;
      this.medicalData = this.scanData.Medical;
      this.geneticData = this.scanData.Genetic;
      this.ethnicData = this.scanData.Ethnic;
      this.biometricData = this.scanData.Biometric;
      this.rag_count = this.scanData.lenarts;
      this.rag_stat = this.scanData.RAG_Statement;
      this.createCircularBarChart();
      console.log(this.rag_count);
    }
  }

  ngAfterViewInit() {
    if (this.progressCanvas && this.progressCanvas.nativeElement) {
      this.drawCircularProgressBar(this.rag_count);
    } else {
      console.error('progressCanvas is not defined');
    }

    if (this.radarChartCanvas && this.radarChartCanvas.nativeElement) {
      this.calculateMetric();
    } else {
      console.error('radarChartCanvas is not defined');
    }

    // this.initializeMap
  }

  createCircularBarChart() {
    const ctx = document.getElementById('circularBarChart') as HTMLCanvasElement;
    if (ctx) {
        const data = {
            labels: ['Personal', 'Medical', 'Ethnic', 'Biometric','Genetic'],
            datasets: [{
                label: 'Scores',
                data: [
                    this.nerCount + this.personalData + this.financialData + this.contactData,
                    this.medicalData,
                    this.ethnicData,
                    this.biometricData,
                    this.geneticData
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.5)',    // Dark teal
                    'rgba(153, 102, 255, 0.5)',   // Dark purple
                    'rgba(255, 159, 64, 0.5)',     // Dark orange
                    'rgba(255, 99, 132, 0.5)',     // Dark pink
                    'rgba(0, 0, 139, 0.5)',        // Dark blue for Ethnic
                    'rgba(139, 0, 0, 0.5)'         // Dark red for Biometric
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',      // Dark teal
                    'rgba(153, 102, 255, 1)',     // Dark purple
                    'rgba(255, 159, 64, 1)',      // Dark orange
                    'rgba(255, 99, 132, 1)',      // Dark pink
                    'rgba(0, 0, 139, 1)',         // Dark blue for Ethnic
                    'rgba(139, 0, 0, 1)'          // Dark red for Biometric
                ],

                borderWidth: 1
            }]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,  // Allow the chart to resize freely within its container
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
        console.error('No canvas context found');
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
    const endAngle = startAngle - (2 * Math.PI * (value / 99)); // Counter-clockwise
  
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw the background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#e6e6e6';
    ctx.fill();
  
    // Draw the inner white circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  
  // Create gradient for the progress circle
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, '#f44336'); // Start color (red)
  gradient.addColorStop(1, '#d32f2f'); // End color (darker red)

  
    // Draw the progress circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, true); // Counter-clockwise
    ctx.lineWidth = 10;
    ctx.strokeStyle = gradient;
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
    const w_med = 0.4;
    const w_gen = 0.2;
    const w_eth = 0.4;
    const w_bio = 2;

    let e_personalData  = Math.exp(this.scanData.Personal + this.financialData + this.contactData + this.personalData);
    let e_med = Math.exp(this.medicalData);
    let e_gen = Math.exp(this.geneticData);
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
            responsive: true,
            maintainAspectRatio: false, // Allow resizing
            scales: {
                r: {
                    beginAtZero: true,
                    max: 1
                }
            }
        }
    });
  }

  populateWithMockData(): void {
    // Populate data with mock structure
    this.data = {
      score: {
        NER: Math.floor(Math.random() * 10),
        location_report: Math.floor(Math.random() * 3), // 0, 1, or 2
        Personal: Math.floor(Math.random() * 10),
        Financial: Math.floor(Math.random() * 10),
        Contact: Math.floor(Math.random() * 10),
        Medical: Math.floor(Math.random() * 10),
        Ethnic: Math.floor(Math.random() * 10),
        Biometric: Math.floor(Math.random() * 10),
        Genetic: Math.floor(Math.random() * 10),
        lenarts: Math.floor(Math.random() * 100),
        RAG_Statement: "Mock RAG Statement"
      }
    };

    // Assign values from data.score
    this.nerCount = this.data.NER;
    this.location = this.data.location_report;
    this.personalData = this.data.Personal;
    this.financialData = this.data.Financial;
    this.contactData = this.data.Contact;
    this.medicalData = this.data.Medical;
    this.ethnicData = this.data.Ethnic;
    this.biometricData = this.data.Biometric;
    this.geneticData = this.data.Genetic;
    this.rag_count = this.data.lenarts;
    this.rag_stat = this.data.RAG_Statement;

    // Create all graphs
    this.createAllGraphs();
  }

  createAllGraphs(): void {
    this.destroyOldGraphs();
    this.createCircularBarChart();
    this.drawCircularProgressBar(this.rag_count);
    this.calculateMetric();
    // this.initializeMap();
  }

  destroyOldGraphs(): void {
    // Remove old SVG elements
    d3.select('#circularBarChart').selectAll('svg').remove();
    d3.select('#progressCanvas').selectAll('svg').remove();
    d3.select('#radarChartCanvas').selectAll('svg').remove();
    d3.select('#map').selectAll('svg').remove();
  }
}