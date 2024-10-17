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
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';



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

  private supabase: SupabaseClient;

  @Input() data: any;
  @ViewChild('progressCanvas') progressCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('radarChartCanvas') radarChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('mapCanvas') mapCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChartCanvas') barChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('gaugeChartCanvas') gaugeChartCanvas!: ElementRef<HTMLCanvasElement>;
  
  
  violationPercentage: number = 0;
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
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
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
    console.log("supadata: " + this.fetchData());

  }

  async fetchData() {  
    const { data: total_violations_summary, error } = await this.supabase
    .from('total_violations_summary')
    .select('*')

    if (error) {
      console.error('Error fetching total violations summary:', error);
    } else {
      console.log('Average Personal Data Violations:', total_violations_summary[0].avg_financial_data_violations);
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

    if (this.barChartCanvas && this.barChartCanvas.nativeElement) {
      this.createComparisonBarChart();
    }
    else {
      console.error('barChartCanvas is not defined');
    }

    // if (this.gaugeChartCanvas && this.gaugeChartCanvas.nativeElement) {
    //   this.calculateMetric();
    //   this.createGaugeChart(this.violationPercentage);
    // }
    // else {
    //   console.error('gaugeChartCanvas is not defined');
    // }

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
                    'rgba(0, 0, 139, 0.5)',        // Dark blue
                    'rgba(139, 0, 0, 0.5)'         // Dark red
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)', 
                    'rgba(255, 99, 132, 1)',
                    'rgba(0, 0, 139, 1)', 
                    'rgba(139, 0, 0, 1)'          
                ],

                borderWidth: 1,
            }]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
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
    const endAngle = startAngle - (2 * Math.PI * (value / 99));
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#e6e6e6';
    ctx.fill();
  
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#f44336'); // Start color (red)
    gradient.addColorStop(1, '#d32f2f'); // End color (darker red)

  

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, true);
    ctx.lineWidth = 10;
    ctx.strokeStyle = gradient;
    ctx.stroke();
  
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
    const w_bio = 0.5;

    const w_sum = w_per + w_med + w_gen + w_eth + w_bio

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

    const N_e_sum = N_e_personalData + N_e_med + N_e_gen + N_e_eth + N_e_bio

    this.violationPercentage = Math.round((w_sum/N_e_sum));
    console.log("vivios: " + this.violationPercentage)
    this.createGaugeChart(this.violationPercentage)
  }

  createGaugeChart(percentage: number) {
    const canvas = this.gaugeChartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
  
    if (!ctx) {
      console.error('Failed to get 2D context');
      return;
    }
  
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Compliance', 'Non-Compliance'],
        datasets: [{
          data: [percentage, 100 - percentage],
          backgroundColor: ['#4CAF50', '#FF5252'],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '80%',
        plugins: {
          tooltip: { enabled: false },
        },
      },
      plugins: [{
        id: 'gaugeText',
        afterDraw(chart) {
          const { ctx, width, height } = chart;
          const fontSize = Math.min(width, height) / 6;
          ctx.save();
          ctx.font = `${fontSize}px Arial`;
          ctx.fillStyle = '#000';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${percentage}%`, width / 2, height / 2);
          ctx.restore();
        },
      }],
    });
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
            maintainAspectRatio: false,
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
    this.data = {
      score: {
        NER: Math.floor(Math.random() * 10),
        location_report: Math.floor(Math.random() * 3),
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
    this.createAllGraphs();
  }

  createAllGraphs(): void {
    this.destroyOldGraphs();
    this.createCircularBarChart();
    this.drawCircularProgressBar(this.rag_count);
    this.calculateMetric();
  }

  destroyOldGraphs(): void {
    d3.select('#circularBarChart').selectAll('svg').remove();
    d3.select('#progressCanvas').selectAll('svg').remove();
    d3.select('#radarChartCanvas').selectAll('svg').remove();
    d3.select('#map').selectAll('svg').remove();
  }

  async createComparisonBarChart() {
    const canvas = this.barChartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
  
    if (!ctx) {
      console.error('Failed to get 2D context');
      return;
    }
  
    const { data: total_violations_summary, error } = await this.supabase
      .from('total_violations_summary')
      .select('*');
  
    if (error) {
      console.error('Error fetching total violations summary:', error);
      return;
    }
  
    const avgData = total_violations_summary[0];
  
    const categories = ['Personal', "Financial", "Contact", 'Medical', 'Genetic', 'Ethnic', 'Biometric'];
    const scannedData = [
      this.personalData,
      this.financialData,
      this.contactData,
      this.medicalData,
      this.geneticData,
      this.ethnicData,
      this.biometricData,
    ];

    const avgViolations = [
      avgData.avg_personal_data_violations,
      avgData.avg_medical_data_violations,
      avgData.avg_genetic_data_violations,
      avgData.avg_ethnic_data_violations,
      avgData.avg_biometric_data_violations,
      avgData.avg_financial_data_violations,
      avgData.avg_financial_data_violations,
    ];
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [
          {
            label: 'Document Violations',
            data: scannedData,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'Average Violations',
            data: avgViolations,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  } 
}