// import { Component, Input, OnInit, AfterViewInit, ElementRef ,ViewChild } from '@angular/core';
// import { Router } from '@angular/router';
// import { Chart, registerables } from 'chart.js';
// import { ActivatedRoute } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { VisualizationService } from '../services/visualization.service';
// // import { BrowserModule } from '@angular/platform-browser';
// // import { AppComponent } from './app.component';
// import 'chartjs-chart-geo';
// import * as d3 from 'd3';
// import * as topojson from 'topojson-client';
// import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
// import {ApexAxisChartSeries,  ApexChart,  ApexXAxis,  ChartComponent,  NgApexchartsModule
// } from "ng-apexcharts";

// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   xaxis: ApexXAxis;
// };
// import { ChoroplethController, GeoFeature , ProjectionScale, ColorScale } from 'chartjs-chart-geo';

// @Component({
//   selector: 'app-visualization',
//   standalone: true,
//   imports: [CommonModule, NgApexchartsModule, NgxEchartsModule],
//   templateUrl: './visualization.component.html',
//   styleUrls: ['./visualization.component.css']
// })
// export class VisualizationComponent implements OnInit, AfterViewInit {

//   @Input() data: any;
//   @ViewChild('progressCanvas') progressCanvas!: ElementRef<HTMLCanvasElement>;
//   @ViewChild('radarChartCanvas') radarChartCanvas!: ElementRef<HTMLCanvasElement>;
//   @ViewChild('mapCanvas') mapCanvas!: ElementRef<HTMLCanvasElement>;

//   nerCount: number = 5;
//   location: number = 2;
//   personalData: number = 7;
//   financialData: number =19;
//   contactData: number = 21;
//   medicalData: number = 14;
//   ethnicData: number = 8;
//   biometricData: number = 6;
//   geneticData: number = 6;
//   rag_count = 0;
//   rag_stat: string = "";

//   receivedData: any;

//   constructor(private router: Router,private visualizationService: VisualizationService) {
//     // Register Chart.js components
//     Chart.register(...registerables, ChoroplethController, GeoFeature, ProjectionScale, ColorScale);
//   }

//   ngOnInit() {
//     this.data = this.visualizationService.getData(); // Get data from the service
//     if (this.data) {
//       console.log('Data in child component:', this.data.score); // Log data only when available
//       this.nerCount = this.data.score.NER;
//       this.location = this.data.score.location_report;
//       this.personalData = this.data.score.Personal;
//       this.financialData =this.data.score.Financial;
//       this.contactData = this.data.score.Contact;
//       this.medicalData = this.data.score.Medical;
//       this.geneticData = this.data.score.Genetic;
//       this.ethnicData = this.data.score.Ethnic;
//       this.biometricData = this.data.score.Biometric;
//       this.rag_count = this.data.score.lenarts;
//       this.rag_stat = this.data.score.RAG_Statement;
//       this.createCircularBarChart();
//       console.log(this.rag_count);
//     }

//     // violation_data = {            
//     //   "score": {
//     //       "Status": status,
//     //       "Location": location_report,
//     //       "NER": ner_result_report,
//     //       "Personal": reg_result_personal_report,
//     //       "Financial": reg_result_financial_report,
//     //       "Contact": reg_result_contact_report,
//     //       "Consent Agreement": ca_statement_report,
//     //       "Genetic": gi_result_report,
//     //       "Ethnic": em_result_report,
//     //       "Medical": md_result_report,
//     //       "Biometric": image_result_report,
//     //       "RAG Statement":rag_stat,
//     //       "len(arts)":rag_count
//     //   }
  
//     // const navigation = this.router.getCurrentNavigation();
//     // this.receivedData = navigation?.extras.state?.['data'];
//     // console.log(navigation?.extras.state?.['data']);
//   }

//   // ngOnInit() {
//   //   const navigation = this.router.getCurrentNavigation();
//   //   if (navigation?.extras.state) {
//   //     const state = navigation.extras.state as {
//   //       nerCount: number,
//   //       location: string,
//   //       personalData: number,
//   //       financialData: number,
//   //       contactData: number,
//   //       medicalData: number,
//   //       ethnicData: number,
//   //       biometricData: number
//   //     };

//   //     this.nerCount = state.nerCount;
//   //     this.location = state.location;
//   //     this.personalData = state.personalData;
//   //     this.financialData = state.financialData;
//   //     this.contactData = state.contactData;
//   //     this.medicalData = state.medicalData;
//   //     this.ethnicData = state.ethnicData;
//   //     this.biometricData = state.biometricData;

//   //     console.log('Received data:', state);  // Debugging log
//   //     this.createCircularBarChart();
//   //   }
//   //   console.log("Starting point")
//   // }

//   ngAfterViewInit() {
//     if (this.progressCanvas && this.progressCanvas.nativeElement) {
//       this.drawCircularProgressBar(this.rag_count);
//     } else {
//       console.error('progressCanvas is not defined');
//     }

//     if (this.radarChartCanvas && this.radarChartCanvas.nativeElement) {
//       this.calculateMetric();
//     } else {
//       console.error('radarChartCanvas is not defined');
//     }

//     this.initializeMap();
//   }

//   onBack() {
//     this.router.navigate(['/upload']);
//   }
//   // createCircularBarChart(): void {
//   //   const width = 500;
//   //   const height = 500;
//   //   const margin = { top: 50, right: 50, bottom: 50, left: 50 };

//   //   const innerRadius = 90;  // Inner radius of the circular bar chart
//   //   const outerRadius = Math.min(width, height) / 2;  // Outer radius

//   //   // Create the SVG element
//   //   const svg = d3.select('#circularBarChart')
//   //     .append('svg')
//   //     .attr('width', width + margin.left + margin.right)
//   //     .attr('height', height + margin.top + margin.bottom)
//   //     .append('g')
//   //     .attr('transform', `translate(${(width + margin.left) / 2}, ${(height + margin.top) / 2})`);

//   //   // X scale: categories
//   //   const x = d3.scaleBand()
//   //     .domain(this.data.map(d => d.category))
//   //     .range([0, 2 * Math.PI]);  // Circle layout

//   //   // Y scale: values
//   //   const y = d3.scaleLinear()
//   //     .domain([0, d3.max(this.data, d => d.value)!])
//   //     .range([innerRadius, outerRadius]);

//   //   // Color scale
//   //   const color = d3.scaleOrdinal()
//   //     .domain(this.data.map(d => d.category))
//   //     .range(['#69b3a2', '#404080', '#f2a12e', '#ff6666', '#b3de69']);

//   //   // Create a tooltip element
//   //   const tooltip = d3.select('body').append('div')
//   //     .attr('class', 'tooltip')
//   //     .style('opacity', 0);

//   //   // Bars with interactivity
//   //   svg.append('g')
//   //     .selectAll('path')
//   //     .data(this.data)
//   //     .enter()
//   //     .append('path')
//   //     .attr('fill', d => color(d.category) as string)
//   //     .attr('d', d3.arc<any>()
//   //       .innerRadius(innerRadius)
//   //       .outerRadius(d => y(d.value))
//   //       .startAngle(d => x(d.category)!)
//   //       .endAngle(d => x(d.category)! + x.bandwidth())
//   //       .padAngle(0.01)
//   //       .padRadius(innerRadius))
//   //     .on('mouseover', (event, d) => {  // Mouseover event
//   //       tooltip.transition()
//   //         .duration(200)
//   //         .style('opacity', 1);
//   //       tooltip.html(`Category: ${d.category}<br>Value: ${d.value}`)
//   //         .style('left', `${event.pageX + 5}px`)
//   //         .style('top', `${event.pageY - 28}px`);
//   //     })
//   //     .on('mouseout', () => {  // Mouseout event
//   //       tooltip.transition()
//   //         .duration(500)
//   //         .style('opacity', 0);
//   //     })
//   //     .on('click', (event, d) => {  // Click event (optional)
//   //       console.log(`${d.category} clicked!`);
//   //     });

//   //   // Add labels
//   //   svg.append('g')
//   //     .selectAll('g')
//   //     .data(this.data)
//   //     .enter()
//   //     .append('g')
//   //     .attr('text-anchor', d => (x(d.category)! + x.bandwidth() / 2 > Math.PI ? 'end' : 'start'))
//   //     .attr('transform', d => `rotate(${((x(d.category)! + x.bandwidth() / 2) * 180 / Math.PI - 90)}) translate(${outerRadius + 10},0)`)
//   //     .append('text')
//   //     .text(d => d.category)
//   //     .attr('transform', d => (x(d.category)! + x.bandwidth() / 2 > Math.PI ? 'rotate(180)' : 'rotate(0)'))
//   //     .style('font-size', '12px')
//   //     .attr('alignment-baseline', 'middle');
//   // }
//   createCircularBarChart() {
//     const ctx = document.getElementById('circularBarChart') as HTMLCanvasElement;
//     if (ctx) {
//         const data = {
//             labels: ['Personal', 'Medical', 'Ethnic', 'Biometric','Genetic'],
//             datasets: [{
//                 label: 'Scores',
//                 data: [
//                     this.nerCount+this.personalData+this.financialData+this.contactData,
//                     this.medicalData,
//                     this.ethnicData,
//                     this.biometricData,
//                     this.geneticData
//                 ],
//                 backgroundColor: [
//                     'rgba(75, 192, 192, 0.5)',    // Dark teal
//                     'rgba(153, 102, 255, 0.5)',   // Dark purple
//                     'rgba(255, 159, 64, 0.5)',     // Dark orange
//                     'rgba(255, 99, 132, 0.5)',     // Dark pink
//                     'rgba(0, 0, 139, 0.5)',        // Dark blue for Ethnic
//                     'rgba(139, 0, 0, 0.5)'         // Dark red for Biometric
//                 ],
//                 borderColor: [
//                     'rgba(75, 192, 192, 1)',      // Dark teal
//                     'rgba(153, 102, 255, 1)',     // Dark purple
//                     'rgba(255, 159, 64, 1)',      // Dark orange
//                     'rgba(255, 99, 132, 1)',      // Dark pink
//                     'rgba(0, 0, 139, 1)',         // Dark blue for Ethnic
//                     'rgba(139, 0, 0, 1)'          // Dark red for Biometric
//                 ],

//                 borderWidth: 1
//             }]
//         };

//         const options = {
//             responsive: true,
//             maintainAspectRatio: false,  // Allow the chart to resize freely within its container
//             scales: {
//                 r: {
//                     beginAtZero: true
//                 }
//             }
//         };

//         new Chart(ctx, {
//             type: 'polarArea',
//             data: data,
//             options: options
//         });
//     } else {
//         console.error('No canvas context found');
//     }
//   }

//   drawCircularProgressBar(value: number) {
//     const canvas = this.progressCanvas.nativeElement;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) {
//       console.error('Failed to get 2D context');
//       return;
//     }
  
//     const centerX = canvas.width / 2;
//     const centerY = canvas.height / 2;
//     const radius = Math.min(centerX, centerY) - 10;
//     const startAngle = -Math.PI / 2;
//     const endAngle = startAngle - (2 * Math.PI * (value / 99)); // Counter-clockwise
  
//     // Clear the canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
  
//     // Draw the background circle
//     ctx.beginPath();
//     ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
//     ctx.fillStyle = '#e6e6e6';
//     ctx.fill();
  
//     // Draw the inner white circle
//     ctx.beginPath();
//     ctx.arc(centerX, centerY, radius - 10, 0, 2 * Math.PI, false);
//     ctx.fillStyle = '#ffffff';
//     ctx.fill();
  
//   // Create gradient for the progress circle
//   const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
//   gradient.addColorStop(0, '#f44336'); // Start color (red)
//   gradient.addColorStop(1, '#d32f2f'); // End color (darker red)

  
//     // Draw the progress circle
//     ctx.beginPath();
//     ctx.arc(centerX, centerY, radius, startAngle, endAngle, true); // Counter-clockwise
//     ctx.lineWidth = 10;
//     ctx.strokeStyle = gradient;
//     ctx.stroke();
  
//     // Draw the text
//     ctx.font = '20px Arial';
//     ctx.fillStyle = '#000';
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';
//     ctx.fillText(`${value}/99`, centerX, centerY);
//   }

//   calculateMetric() {

//     const w_per = 1;
//     const w_med = 0.4;
//     const w_gen = 0.2;
//     const w_eth = 0.4;
//     const w_bio = 2;

//     let e_personalData  = Math.exp(this.data.score.Personal + this.financialData + this.contactData + this.personalData);
//     let e_med = Math.exp(this.medicalData);
//     let e_gen = Math.exp(this.geneticData);
//     let e_eth = Math.exp(this.ethnicData);
//     let e_bio = Math.exp(this.biometricData);

//     const expValues = [e_personalData, e_med, e_gen, e_eth, e_bio];

//     let maxExpValue = expValues[0];

//     for (let i = 1; i < expValues.length; i++) {
//       if (expValues[i] > maxExpValue) {
//         maxExpValue = expValues[i];
//       }
//     }

//     let N_e_personalData = (e_personalData/maxExpValue)*w_per;
//     let N_e_med = (e_med/maxExpValue)*w_med;
//     let N_e_gen = (e_gen/maxExpValue)*w_gen;
//     let N_e_eth = (e_eth/maxExpValue)*w_eth;
//     let N_e_bio = (e_bio / maxExpValue)*w_bio;
    
//     this.createRadarChart([N_e_personalData, N_e_med, N_e_gen, N_e_eth, N_e_bio]);

//   }
 
//   createRadarChart(data: number[]) {
//     const canvas = this.radarChartCanvas.nativeElement;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) {
//         console.error('Failed to get 2D context');
//         return;
//     }

//     new Chart(ctx, {
//         type: 'radar',
//         data: {
//             labels: ['Personal', 'Medical', 'Genetic', 'Ethnic', 'Biometric'],
//             datasets: [{
//                 label: 'Normalized Data',
//                 data: data,
//                 backgroundColor: 'rgba(54, 162, 235, 0.2)',
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false, // Allow resizing
//             scales: {
//                 r: {
//                     beginAtZero: true,
//                     max: 1
//                 }
//             }
//         }
//     });
//   }

//   initializeMap(): void {
//     const width = 960;
//     const height = 600;

//     const svg = d3.select('#map')
//       .append('svg')
//       .attr('width', width)
//       .attr('height', height);

//     const projection = d3.geoMercator()
//       .scale(150)
//       .translate([width / 2, height / 2]);

//     const path = d3.geoPath().projection(projection);

//     // Use a valid map data URL
//     d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json').then((worldData: any) => {
//       const countries = (topojson.feature(worldData, worldData.objects.countries) as any).features;

//       svg.selectAll('path')
//         .data(countries)
//         .enter().append('path')
//         .attr('d', path as unknown as string)
//         .attr('fill', (d: any) => this.getCountryColor(d.id))
//         .attr('stroke', '#ffffff')
//         .attr('stroke-width', 0.5);

//     }).catch((error) => {
//       console.error('Error loading map data:', error);
//     });
//   }

//   getCountryColor(countryId: string): string {
//     const euCountries = ['008', '040', '056', '100', '191', '196', '203', '208', '233', '246', '250', '276', '300', '348', '352', '372', '380', '428', '440', '442', '470', '528', '616', '620', '703', '705', '724', '752', '826'];

//     const nonEuCountries = [
//       '004', '012', '020', '024', '028', '032', '036', '044', '048', '050', '051', '052', '060', 
//       '064', '068', '070', '072', '076', '084', '090', '096', '104', '108', '112', '116', '120', 
//       '132', '136', '140', '144', '148', '152', '156', '170', '174', '178', '180', '184', '188', 
//       '192', '204', '208', '212', '214', '218', '222', '226', '231', '232', '234', '238', '242', 
//       '254', '258', '262', '266', '270', '275', '288', '292', '296', '304', '308', '312', '316', 
//       '320', '324', '328', '332', '340', '344', '348', '352', '356', '360', '364', '368', '376', 
//       '384', '388', '392', '398', '400', '404', '408', '410', '414', '417', '418', '422', '426', 
//       '430', '434', '438', '446', '450', '454', '458', '462', '466', '474', '478', '480', '484', 
//       '492', '496', '498', '499', '500', '504', '508', '512', '516', '520', '524', '531', '533', 
//       '534', '535', '540', '548', '554', '558', '562', '566', '570', '574', '578', '580', '583', 
//       '584', '585', '586', '591', '598', '600', '604', '608', '612', '620', '624', '626', '630', 
//       '634', '638', '642', '643', '646', '652', '654', '659', '660', '662', '663', '666', '670', 
//       '674', '678', '682', '686', '688', '690', '694', '702', '704', '706', '710', '716', '728', 
//       '729', '732', '740', '748', '756', '760', '762', '764', '768', '772', '776', '780', '784', 
//       '788', '792', '795', '796', '798', '800', '804', '807', '818', '834', '840', '850', '854', 
//       '858', '860', '862', '876', '882', '887', '894'
//     ];

//     // Add specific IDs for US and UK
//     const specialCountries: { [key: string]: string } = {
//         '826': 'purple', // UK
//         '840': 'purple'  // US
//     };

//     // Existing switch logic for other locations
//     switch (this.location) {
//       case 0: // EU in red, others not highlighted
//         return euCountries.includes(countryId) ? 'red' : '#d3d3d3';
//       case 1: // Non-EU in green, others not highlighted
//         return nonEuCountries.includes(countryId) ? 'green' : '#d3d3d3';
//       case 2: // Optional: All in light grey
//       default:
//         // Check for US and UK before returning light grey
//         if (specialCountries[countryId]) {
//             return specialCountries[countryId];  // Return purple for US and UK
//         }
//         return '#d3d3d3';  // Light grey for all other countries
//      }
//     }

//   isEU(countryId: number): boolean {
//     const euCountryIds = [
//       56,   // Belgium
//       250,  // France
//       276,  // Germany
//       300,  // Greece
//       372,  // Ireland
//       380,  // Italy
//       528,  // Netherlands
//       620,  // Portugal
//       724,  // Spain
//       826,  // United Kingdom (historically in EU, but removed after Brexit)
//       208,  // Denmark
//       246,  // Finland
//       348,  // Hungary
//       352,  // Iceland
//       196,  // Cyprus
//       40,   // Austria
//       578,  // Norway
//       642,  // Romania
//       703,  // Slovakia
//       705,  // Slovenia
//       100,  // Bulgaria
//       191,  // Croatia
//       203,  // Czech Republic
//       348,  // Hungary
//       233,  // Estonia
//       428,  // Latvia
//       440,  // Lithuania
//       616,  // Poland
//       703,  // Slovakia
//       752,  // Sweden
//       792   // Turkey (negotiating EU membership, not officially in the EU)
//     ];
//     return euCountryIds.includes(countryId);
//   }

//   populateWithMockData(): void {
//     // Populate data with mock structure
//     this.data = {
//       score: {
//         NER: Math.floor(Math.random() * 10),
//         location_report: Math.floor(Math.random() * 3), // 0, 1, or 2
//         Personal: Math.floor(Math.random() * 10),
//         Financial: Math.floor(Math.random() * 10),
//         Contact: Math.floor(Math.random() * 10),
//         Medical: Math.floor(Math.random() * 10),
//         Ethnic: Math.floor(Math.random() * 10),
//         Biometric: Math.floor(Math.random() * 10),
//         Genetic: Math.floor(Math.random() * 10),
//         lenarts: Math.floor(Math.random() * 100),
//         RAG_Statement: "Mock RAG Statement"
//       }
//     };

//     // Assign values from data.score
//     this.nerCount = this.data.score.NER;
//     this.location = this.data.score.location_report;
//     this.personalData = this.data.score.Personal;
//     this.financialData = this.data.score.Financial;
//     this.contactData = this.data.score.Contact;
//     this.medicalData = this.data.score.Medical;
//     this.ethnicData = this.data.score.Ethnic;
//     this.biometricData = this.data.score.Biometric;
//     this.geneticData = this.data.score.Genetic;
//     this.rag_count = this.data.score.lenarts;
//     this.rag_stat = this.data.score.RAG_Statement;

//     // Create all graphs
//     this.createAllGraphs();
//   }

//   createAllGraphs(): void {
//     this.destroyOldGraphs();
//     this.createCircularBarChart();
//     this.drawCircularProgressBar(this.rag_count);
//     this.calculateMetric();
//     this.initializeMap();
//   }

//   destroyOldGraphs(): void {
//     // Remove old SVG elements
//     d3.select('#circularBarChart').selectAll('svg').remove();
//     d3.select('#progressCanvas').selectAll('svg').remove();
//     d3.select('#radarChartCanvas').selectAll('svg').remove();
//     d3.select('#map').selectAll('svg').remove();
//   }
// }

// src/app/visualization/visualization.component.ts

// src/app/visualization/visualization.component.ts
// import { Component, OnInit, ViewChild } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { NgApexchartsModule } from 'ng-apexcharts';
// import { VisualizationService } from '../services/visualization.service';
// import { Subscription } from 'rxjs';

// import {
//   ChartComponent,
//   ApexNonAxisChartSeries,
//   ApexChart,
//   ApexPlotOptions,
//   ApexFill,
//   ApexStroke,
//   ApexDataLabels,
// } from 'ng-apexcharts';

// export type ChartOptions = {
//   series: ApexNonAxisChartSeries;
//   chart: ApexChart;
//   plotOptions: ApexPlotOptions;
//   fill: ApexFill;
//   stroke: ApexStroke;
//   dataLabels: ApexDataLabels;
//   labels: string[];
// };

// @Component({
//   selector: 'app-visualization',
//   standalone: true,
//   imports: [CommonModule, NgApexchartsModule],
//   templateUrl: './visualization.component.html',
//   styleUrls: ['./visualization.component.css']
// })
// export class VisualizationComponent implements OnInit {
//   @ViewChild('chart') chart!: ChartComponent;
//   public chartOptions: Partial<ChartOptions>;

//   scanDataSubscription: Subscription;
//   scanData: any;

//   constructor(private scanDataService: VisualizationService) {
//     // Initialize chartOptions with default values
//     this.chartOptions = {
//       series: [0, 0, 0, 0, 0], // Initialize with 5 zeroes for each category
//       labels: ['Personal Data', 'Medical', 'Ethnic', 'Biometric', 'Genetic'], // Labels for the categories
//       chart: {
//         height: 350,
//         type: 'radialBar'
//       },
//       plotOptions: {
//         radialBar: {
//           dataLabels: {
//             name: {
//               show: true,
//               fontSize: '22px'
//             },
//             value: {
//               show: true,
//               fontSize: '16px',
//               formatter: (val: number) => `${val.toFixed(2)}%` // Display percentage with two decimal places
//             }
//           }
//         }
//       },
//       fill: {
//         colors: ['#20E647', '#FF4560', '#FEB019', '#775DD0', '#00E396'] // Different colors for each category
//       },
//       stroke: {
//         lineCap: 'round'
//       },
//     };
//     this.scanDataSubscription = new Subscription();
//     this.scanData = null;
//   }

//   ngOnInit(): void {
//     this.scanDataSubscription = this.scanDataService.getScanData().subscribe(data => {
//       if (data) {
//         this.scanData = data;
//         this.updateChart();
//         console.log(this.scanData)
//       }

//       else{console.log(this.scanData)}
//     });
//   }

//   ngOnDestroy(): void {
//     this.scanDataSubscription.unsubscribe();
//   }

//   updateChart() {
//     if (this.scanData) {
//       // Calculate Personal Data
//       const personalData = this.scanData.NER + this.scanData.personal + this.scanData.financial + this.scanData.contact;
//       const medical = this.scanData.medical;
//       const ethnic = this.scanData.ethnic;
//       const biometric = this.scanData.biometric;
//       const genetic = this.scanData.genetic;

//       const totalIssues = personalData + medical + ethnic + biometric + genetic;

//       // Prevent division by zero
//       const series = totalIssues > 0 ? [
//         (personalData / totalIssues) * 100,
//         (medical / totalIssues) * 100,
//         (ethnic / totalIssues) * 100,
//         (biometric / totalIssues) * 100,
//         (genetic / totalIssues) * 100
//       ] : [0, 0, 0, 0, 0];

//       this.chartOptions.series = series;
//       console.log('VisualizationComponent: Updating chart with series:', series);
//     }
//   }
// }
// src/app/visualization/visualization.component.ts
// src/app/visualization/visualization.component.ts
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { VisualizationService } from '../services/visualization.service';
import { Subscription } from 'rxjs';
import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexFill,
  ApexStroke,
  ApexDataLabels,
} from 'ng-apexcharts';


export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  labels: string[];
};

@Component({
  selector: 'app-visualization',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})
export class VisualizationComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  scanDataSubscription: Subscription;
  scanData: any;

  constructor(private scanDataService: VisualizationService) {
    // Initialize chartOptions with default values
    this.chartOptions = {
      series: [0, 0, 0, 0, 0], // Initialize with 5 zeroes for each category
      labels: ['Personal Data', 'Medical', 'Ethnic', 'Biometric', 'Genetic'], // Labels for the categories
      chart: {
        height: 350,
        type: 'radialBar'
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              show: true,
              fontSize: '22px'
            },
            value: {
              show: true,
              fontSize: '16px',
              formatter: (val: number) => `${val.toFixed(2)}%` // Display percentage with two decimal places
            }
          },
          hollow: {
            size: '20%' // Reduced from 70% to allow more space for rings
          },
          track: {
            background: '#f0f0f0',
            strokeWidth: '8%', // Thinner stroke to accommodate multiple rings
            margin: 5, // Margin between rings
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              blur: 4,
              opacity: 0.1
            }
          }
        }
      },
      fill: {
        colors: ['#20E647', '#FF4560', '#FEB019', '#775DD0', '#00E396'] // Different colors for each category
      },
      stroke: {
        lineCap: 'round'
      },
      // tooltip: {
      //   enabled: true,
      //   y: {
      //     formatter: (val: number) => `${val.toFixed(2)}% of total issues`
      //   }
      // }
    };
    this.scanDataSubscription = new Subscription();
    this.scanData = null;
  }

  ngOnInit(): void {
    this.scanDataSubscription = this.scanDataService.getScanData().subscribe(data => {
      console.log('VisualizationComponent: Received scan data:', data);
      if (data) {
        this.scanData = data;
        this.updateChart();
      } else {
        console.log('VisualizationComponent: No scan data received.');
      }
    });
  }

  ngOnDestroy(): void {
    this.scanDataSubscription.unsubscribe();
  }

  updateChart() {
    if (this.scanData) {
      // Calculate Personal Data
      const personalData = this.scanData.NER + this.scanData.Personal + this.scanData.Financial + this.scanData.Contact;
      const medical = this.scanData.Medical;
      const ethnic = this.scanData.Ethnic;
      const biometric = this.scanData.Biometric;
      const genetic = this.scanData.Genetic;

      const totalIssues = personalData + medical + ethnic + biometric + genetic;

      // Prevent division by zero
      const series = totalIssues > 0 ? [
        (personalData / totalIssues) * 100,
        (medical / totalIssues) * 100,
        (ethnic / totalIssues) * 100,
        (biometric / totalIssues) * 100,
        (genetic / totalIssues) * 100
      ] : [0, 0, 0, 0, 0];

      this.chartOptions.series = series;
      console.log('VisualizationComponent: Updating chart with series:', series);
    }
  }
}
