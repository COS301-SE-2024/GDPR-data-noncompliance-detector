// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Chart } from 'chart.js/auto';
// import {FormsModule, NgModel} from "@angular/forms";
//
// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css']
// })
// export class HomeComponent implements OnInit {
//
//   timeRange: string = '7d';
//   violationTrends: any[] = [
//     { date: '2024-08-26', count: 15 },
//     { date: '2024-08-27', count: 20 },
//     { date: '2024-08-28', count: 18 },
//     { date: '2024-08-29', count: 25 },
//     { date: '2024-08-30', count: 22 },
//     { date: '2024-08-31', count: 30 },
//     { date: '2024-09-01', count: 28 },
//   ];
//   violationTypes: any[] = [
//     { name: 'Personal Data Breach', value: 35 },
//     { name: 'Consent Violation', value: 25 },
//     { name: 'Data Retention', value: 20 },
//     { name: 'Other', value: 20 },
//     { name: 'Biometric Data', value: 15 },
//     {name:'Medical Data', value: 10},
//     {name:'Ethnic Data', value: 5},
//   ];
//
//   ngOnInit() {
//     this.createViolationTrendChart();
//     this.createViolationTypesChart();
//   }
//
//   createViolationTrendChart() {
//     const ctx = document.getElementById('violationTrendChart') as HTMLCanvasElement;
//     new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: this.violationTrends.map(item => item.date),
//         datasets: [{
//           label: 'Violations',
//           data: this.violationTrends.map(item => item.count),
//           borderColor: 'rgb(75, 192, 192)',
//           tension: 0.1
//         }]
//       },
//       options: {
//         responsive: true,
//         scales: {
//           y: {
//             beginAtZero: true
//           }
//         }
//       }
//     });
//   }
//
//   createViolationTypesChart() {
//     const ctx = document.getElementById('violationTypesChart') as HTMLCanvasElement;
//     new Chart(ctx, {
//       type: 'pie',
//       data: {
//         labels: this.violationTypes.map(item => item.name),
//         datasets: [{
//           data: this.violationTypes.map(item => item.value),
//           backgroundColor: [
//             'rgb(255, 99, 132)',
//             'rgb(54, 162, 235)',
//             'rgb(255, 205, 86)',
//             'rgb(75, 192, 192)',
//             'rgb(123,135,238)',
//             'rgb(182,120,80)',
//             'rgb(41,62,79)'
//           ]
//         }]
//       },
//       options: {
//         responsive: true
//       }
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private supabase: SupabaseClient;

  timeRange: string = '7d';
  totalViolations: number = 0;
  totalViolationsTrend: number = 0;
  documentsScanned: number = 0;
  documentsScannedTrend: number = 0;
  highestViolationCategory: string = '';
  highestViolationCategoryDiff: number = 0;
  lastScan: string = '';

  violationTrends: any[] = [];
  violationTypes: any[] = [];
  recentReports: any[] = [];

  constructor() {
    // this.supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_KEY');
    this.supabase = createClient('https://oadcyxznbhdrzsutusbh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZGN5eHpuYmhkcnpzdXR1c2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4MTAyNDUsImV4cCI6MjA0MTM4NjI0NX0.DLDq7NyjhmEv9V1bRERp2e5XT0-qFdBjWN3BNed6EfY');

  }

  async ngOnInit() {
    await this.fetchData();
    this.createCharts();
  }

  async fetchData() {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - parseInt(this.timeRange));

    // Fetching violation reports
    const { data: reports, error } = await this.supabase
      .from('violation_reports')
      .select('*')
      .gte('report_date', startDate.toISOString())
      .order('report_date', { ascending: false });

    if (error) {
      console.error('Error fetching data:', error);
      return;
    }

    // Processing data for dashboard
    this.processReports(reports);
  }

  processReports(reports: any[]) {
    this.recentReports = reports.slice(0, 10);  // Get 10 most recent reports

    // Calculating the total violations and documents scanned
    this.totalViolations = reports.reduce((sum, report) => sum + report.total_violations, 0);
    this.documentsScanned = reports.length;

    // Calculating the trends
    this.totalViolationsTrend = 5;  // Placeholder value
    this.documentsScannedTrend = 3;  // Placeholder value

    // Finding the highest violation category
    const categories = ['personal_data_violations', 'medical_data_violations', 'biometric_data_violations', 'ethnic_data_violations'];
    const totals = categories.map(cat => reports.reduce((sum, report) => sum + report[cat], 0));
    const maxIndex = totals.indexOf(Math.max(...totals));
    this.highestViolationCategory = categories[maxIndex].split('_')[0];
    this.highestViolationCategoryDiff = 2;  // Placeholder value

    this.lastScan = reports[0]?.report_date || 'N/A';

    // Preparing the data for charts
    this.prepareChartData(reports);
  }

  prepareChartData(reports: any[]) {
    // Preparing violations trends data
    this.violationTrends = reports.map(report => ({
      date: new Date(report.report_date).toISOString().split('T')[0],
      count: report.total_violations
    }));

    // Preparing violations types data
    this.violationTypes = [
      { name: 'Personal Data', value: reports.reduce((sum, report) => sum + report.personal_data_violations, 0) },
      { name: 'Medical Data', value: reports.reduce((sum, report) => sum + report.medical_data_violations, 0) },
      { name: 'Biometric Data', value: reports.reduce((sum, report) => sum + report.biometric_data_violations, 0) },
      { name: 'Ethnic Data', value: reports.reduce((sum, report) => sum + report.ethnic_data_violations, 0) }
    ];
  }

  createCharts() {
    this.createViolationTrendChart();
    this.createViolationTypesChart();
    this.createViolationTypeTrendCharts();
  }

  createViolationTrendChart() {
    const ctx = document.getElementById('violationTrendChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.violationTrends.map(item => item.date),
        datasets: [{
          label: 'Violations',
          data: this.violationTrends.map(item => item.count),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createViolationTypesChart() {
    const ctx = document.getElementById('violationTypesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.violationTypes.map(item => item.name),
        datasets: [{
          data: this.violationTypes.map(item => item.value),
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)'
          ]
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  createViolationTypeTrendCharts() {
    const types = ['personal', 'medical', 'biometric', 'ethnic'];
    types.forEach(type => {
      const ctx = document.getElementById(`${type}DataTrendChart`) as HTMLCanvasElement;
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.violationTrends.map(item => item.date),
          datasets: [{
            label: `${type.charAt(0).toUpperCase() + type.slice(1)} Data Violations`,
            data: this.recentReports.map(report => report[`${type}_data_violations`]),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });
  }

  async updateDashboard() {
    await this.fetchData();
    // Clearing the existing charts
    Chart.getChart('violationTrendChart')?.destroy();
    Chart.getChart('violationTypesChart')?.destroy();
    Chart.getChart('personalDataTrendChart')?.destroy();
    Chart.getChart('medicalDataTrendChart')?.destroy();
    Chart.getChart('biometricDataTrendChart')?.destroy();
    Chart.getChart('ethnicDataTrendChart')?.destroy();
    // Recreating charts with new data
    this.createCharts();
  }
}
