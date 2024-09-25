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

  constructor(private router: Router,private visualizationService: VisualizationService) {
    // Register Chart.js components
    Chart.register(...registerables, ChoroplethController, GeoFeature, ProjectionScale, ColorScale);
  }

  ngOnInit() {
    this.data = this.visualizationService.getData(); // Get data from the service
    if (this.data) {
      // console.log('Data in child component:', this.data.score.Biometric); // Log data only when available
      this.nerCount = this.data.score.NER;
      this.location = this.data.score.location_report;
      this.personalData = this.data.score.Personal;
      this.financialData =this.data.score.Financial;
      this.contactData = this.data.score.Contact;
      this.medicalData = this.data.score.Medical;
      this.geneticData = this.data.score.Genetic;
      this.ethnicData = this.data.score.Ethnic;
      this.biometricData = this.data.score.Biometric;
      this.rag_count = this.data.score.lenarts;
      this.rag_stat = this.data.score.RAG_Statement;
      this.createCircularBarChart();
      console.log(this.rag_count);
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

    this.initializeMap();
  }

  // createCircularBarChart(): void {
  //   const width = 500;
  //   const height = 500;
  //   const margin = { top: 50, right: 50, bottom: 50, left: 50 };

  //   const innerRadius = 90;  // Inner radius of the circular bar chart
  //   const outerRadius = Math.min(width, height) / 2;  // Outer radius

  //   // Create the SVG element
  //   const svg = d3.select('#circularBarChart')
  //     .append('svg')
  //     .attr('width', width + margin.left + margin.right)
  //     .attr('height', height + margin.top + margin.bottom)
  //     .append('g')
  //     .attr('transform', `translate(${(width + margin.left) / 2}, ${(height + margin.top) / 2})`);

  //   // X scale: categories
  //   const x = d3.scaleBand()
  //     .domain(this.data.map(d => d.category))
  //     .range([0, 2 * Math.PI]);  // Circle layout

  //   // Y scale: values
  //   const y = d3.scaleLinear()
  //     .domain([0, d3.max(this.data, d => d.value)!])
  //     .range([innerRadius, outerRadius]);

  //   // Color scale
  //   const color = d3.scaleOrdinal()
  //     .domain(this.data.map(d => d.category))
  //     .range(['#69b3a2', '#404080', '#f2a12e', '#ff6666', '#b3de69']);

  //   // Create a tooltip element
  //   const tooltip = d3.select('body').append('div')
  //     .attr('class', 'tooltip')
  //     .style('opacity', 0);

  //   // Bars with interactivity
  //   svg.append('g')
  //     .selectAll('path')
  //     .data(this.data)
  //     .enter()
  //     .append('path')
  //     .attr('fill', d => color(d.category) as string)
  //     .attr('d', d3.arc<any>()
  //       .innerRadius(innerRadius)
  //       .outerRadius(d => y(d.value))
  //       .startAngle(d => x(d.category)!)
  //       .endAngle(d => x(d.category)! + x.bandwidth())
  //       .padAngle(0.01)
  //       .padRadius(innerRadius))
  //     .on('mouseover', (event, d) => {  // Mouseover event
  //       tooltip.transition()
  //         .duration(200)
  //         .style('opacity', 1);
  //       tooltip.html(`Category: ${d.category}<br>Value: ${d.value}`)
  //         .style('left', `${event.pageX + 5}px`)
  //         .style('top', `${event.pageY - 28}px`);
  //     })
  //     .on('mouseout', () => {  // Mouseout event
  //       tooltip.transition()
  //         .duration(500)
  //         .style('opacity', 0);
  //     })
  //     .on('click', (event, d) => {  // Click event (optional)
  //       console.log(`${d.category} clicked!`);
  //     });

  //   // Add labels
  //   svg.append('g')
  //     .selectAll('g')
  //     .data(this.data)
  //     .enter()
  //     .append('g')
  //     .attr('text-anchor', d => (x(d.category)! + x.bandwidth() / 2 > Math.PI ? 'end' : 'start'))
  //     .attr('transform', d => `rotate(${((x(d.category)! + x.bandwidth() / 2) * 180 / Math.PI - 90)}) translate(${outerRadius + 10},0)`)
  //     .append('text')
  //     .text(d => d.category)
  //     .attr('transform', d => (x(d.category)! + x.bandwidth() / 2 > Math.PI ? 'rotate(180)' : 'rotate(0)'))
  //     .style('font-size', '12px')
  //     .attr('alignment-baseline', 'middle');
  // }
  createCircularBarChart() {
    const ctx = document.getElementById('circularBarChart') as HTMLCanvasElement;
    if (ctx) {
        const data = {
            labels: ['Personal', 'Medical', 'Ethnic', 'Biometric','Genetic'],
            datasets: [{
                label: 'Scores',
                data: [
                    this.nerCount+this.personalData+this.financialData+this.contactData,
                    this.medicalData,
                    this.ethnicData,
                    this.biometricData,
                    this.geneticData
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 99, 132, 1)'
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
    gradient.addColorStop(0, '#ff9800'); // Start color (orange)
    gradient.addColorStop(1, '#ff5722'); // End color (darker orange)
  
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
    const w_gen = 0.4;
    const w_eth = 0.4;
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

  initializeMap(): void {
    const width = 960;
    const height = 600;

    const svg = d3.select('#map')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const projection = d3.geoMercator()
      .scale(150)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Use a valid map data URL
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json').then((worldData: any) => {
      const countries = (topojson.feature(worldData, worldData.objects.countries) as any).features;

      svg.selectAll('path')
        .data(countries)
        .enter().append('path')
        .attr('d', path as unknown as string)
        .attr('fill', (d: any) => this.getCountryColor(d.id))
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 0.5);

    }).catch((error) => {
      console.error('Error loading map data:', error);
    });
  }

  getCountryColor(countryId: string): string {
    const euCountries = [
      '008', '040', '056', '100', '191', '196', '203', '208', '233', '246', '250', '276', 
      '300', '348', '352', '372', '380', '428', '440', '442', '470', '528', '616', '620', 
      '703', '705', '724', '752', '826' // List of EU countries by ISO 3166-1 numeric codes
    ];

    const nonEuCountries = [
      '840', '156', '643', '356', '392', '484', '036', '124', '410', '608' // Add more Non-EU countries by ISO 3166-1 numeric codes
    ];

    switch (this.location) {
      case 0: // EU in red, others not highlighted
        return euCountries.includes(countryId) ? 'red' : '#d3d3d3';
      case 1: // Non-EU in green, others not highlighted
        return nonEuCountries.includes(countryId) ? 'green' : '#d3d3d3';
      case 2: // Optional: All in light grey
      default:
        return '#d3d3d3';
    }
  }

  isEU(countryId: number): boolean {
    const euCountryIds = [
      56,   // Belgium
      250,  // France
      276,  // Germany
      300,  // Greece
      372,  // Ireland
      380,  // Italy
      528,  // Netherlands
      620,  // Portugal
      724,  // Spain
      826,  // United Kingdom (historically in EU, but removed after Brexit)
      208,  // Denmark
      246,  // Finland
      348,  // Hungary
      352,  // Iceland
      196,  // Cyprus
      40,   // Austria
      578,  // Norway
      642,  // Romania
      703,  // Slovakia
      705,  // Slovenia
      100,  // Bulgaria
      191,  // Croatia
      203,  // Czech Republic
      348,  // Hungary
      233,  // Estonia
      428,  // Latvia
      440,  // Lithuania
      616,  // Poland
      703,  // Slovakia
      752,  // Sweden
      792   // Turkey (negotiating EU membership, not officially in the EU)
    ];
    return euCountryIds.includes(countryId);
  }

}