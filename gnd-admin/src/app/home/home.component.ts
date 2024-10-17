import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

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

  constructor(private authService:AuthService, private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

  }

  async ngOnInit() {
    if (!this.authService.isLoggedIn.getValue()) {
      this.router.navigate(['/login']);
    } else {
      await this.fetchData();
      this.createCharts();
    }
  }


  async fetchData() {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - parseInt(this.timeRange));
  
    // Fetching current violation reports
    const { data: currentReports, error: currentError } = await this.supabase
      .from('violations_reports')
      .select('*')
      .gte('report_date', startDate.toISOString())
      .order('report_date', { ascending: false });
  
    if (currentError) {
      console.error('Error fetching current data:', currentError);
      return;
    }

      
    // Fetching previous violation reports for trend calculation
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - parseInt(this.timeRange));
  
    const { data: previousReports, error: previousError } = await this.supabase
      .from('violations_reports')
      .select('*')
      .gte('report_date', previousStartDate.toISOString())
      .lte('report_date', startDate.toISOString());
  
    if (previousError) {
      console.error('Error fetching previous data:', previousError);
      return;
    }
  
    // Processing current reports and calculate trends
    this.processReports(currentReports, previousReports);
  }
  
  processReports(currentReports: any[], previousReports: any[]) {
    this.recentReports = currentReports.slice(0, 30);  
  
    // Calculating total violations and documents scanned for the current period
    const currentTotalViolations = currentReports.reduce((sum, report) => sum + report.total_violations, 0);
    this.totalViolations = currentTotalViolations;
    this.documentsScanned = currentReports.length;
  
    // Calculating total violations for the previous period
    const previousTotalViolations = previousReports.reduce((sum, report) => sum + report.total_violations, 0);
    const previousDocumentsScanned = previousReports.length;
  
    // Calculating the percentage trend for violations
    if (previousTotalViolations > 0) {
      this.totalViolationsTrend = ((currentTotalViolations - previousTotalViolations) / previousTotalViolations) * 100;
    } else {
      this.totalViolationsTrend = currentTotalViolations > 0 ? 100 : 0; 
    }
  
    // Calculating the percentage trend for documents scanned
    if (previousDocumentsScanned > 0) {
      this.documentsScannedTrend = ((this.documentsScanned - previousDocumentsScanned) / previousDocumentsScanned) * 100;
    } else {
      this.documentsScannedTrend = this.documentsScanned > 0 ? 100 : 0;
    }
  
    // Calculating the highest violation category difference
    const categories = ['personal_data_violations', 'medical_data_violations', 'biometric_data_violations', 'ethnic_data_violations', 'genetic_data_violations','financial_data_violations', 'contact_data_violations'];
    const currentTotals = categories.map(cat => currentReports.reduce((sum, report) => sum + report[cat], 0));
    const previousTotals = categories.map(cat => previousReports.reduce((sum, report) => sum + report[cat], 0));
  
    const maxIndex = currentTotals.indexOf(Math.max(...currentTotals));
    this.highestViolationCategory = categories[maxIndex].split('_')[0];
  
    if (previousTotals[maxIndex] > 0) {
      this.highestViolationCategoryDiff = ((currentTotals[maxIndex] - previousTotals[maxIndex]) / previousTotals[maxIndex]) * 100;
    } else {
      this.highestViolationCategoryDiff = currentTotals[maxIndex] > 0 ? 100 : 0;
    }
  
    this.lastScan = currentReports[0]?.report_date || 'N/A';
  
    // Preparing chart data
    this.prepareChartData(currentReports);
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
      { name: 'Ethnic Data', value: reports.reduce((sum, report) => sum + report.ethnic_data_violations, 0) },
      { name: 'Genetic Data', value: reports.reduce((sum, report) => sum + report.genetic_data_violations, 0) },
      { name: 'Financial Data', value: reports.reduce((sum, report) => sum + report.financial_data_violations, 0) },
      { name: 'Contact Data', value: reports.reduce((sum, report) => sum + report.contact_data_violations, 0) },
      { name: 'Consent Agreement', value: reports.reduce((sum, report) => sum + report.consent_agreement_violations, 0) }
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
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time-Stamps'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Number of Violations'
            },
            beginAtZero: true
          }
        }
      }
    });
}

  createViolationTypesChart() {
    const ctx = document.getElementById('violationTypesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.violationTypes.map(item => item.name),
        datasets: [{
          data: this.violationTypes.map(item => item.value),
          backgroundColor: [
            'rgb(255, 99, 132)', //Personal data
            'rgb(54, 162, 235)', //Medical Data
            'rgb(255, 205, 86)', //Biometric data
            'rgb(75, 192, 192)', //Ethnic data
            'rgb(153, 102, 255)',//Genetic data
            'rgb(255, 159, 64)', //Financial data
            'rgb(0,128,0)', //Contact data
            'rgb(0,255,255)', //Consent agreement
          ]
        }]
      },
      options: {
        responsive: true,
        aspectRatio:1.5,
        animation:{
          animateScale : true,
          animateRotate : true
        }
      }
    });
  }

  createViolationTypeTrendCharts() {
  const types: Array<'personal' | 'medical' | 'biometric' | 'ethnic' | 'genetic' | 'financial' | 'contact'> = [
    'personal', 'medical', 'biometric', 'ethnic', 'genetic', 'financial', 'contact'
  ];
  
  const colors = {
    personal: 'rgb(255, 99, 132)', // Red for Personal Data
    medical: 'rgb(54, 162, 235)',  // Blue for Medical Data
    biometric: 'rgb(255, 205, 86)', // Yellow for Biometric Data
    ethnic: 'rgb(75, 192, 192)',   // Green for Ethnic Data
    genetic: 'rgb(153, 102, 255)', // Purple for Genetic Data
    financial: 'rgb(255, 159, 64)',// Orange for Financial Data
    contact: 'rgb(0,128,0)',       // Green for Contact Data
  };

  types.forEach(type => {
    const ctx = document.getElementById(`${type}DataTrendChart`) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.violationTrends.map(item => item.date),
        datasets: [{
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Data Violations`,
          data: this.recentReports.map(report => report[`${type}_data_violations`]),
          borderColor: colors[type], // Fixed TypeScript error by restricting 'type' values
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          tension: 0.4,
          fill: true, // To make the area under the line filled
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
          duration: 1000, // Smooth animation when the chart loads
          easing: 'easeOutBounce'
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time-Stamps'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Number of Violations'
            },
            beginAtZero: true
          }
        },
        plugins: {
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(tooltipItem) {
                return `Violations: ${tooltipItem.raw}`;
              }
            }
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
    Chart.getChart('geneticDataTrendChart')?.destroy();
    Chart.getChart('financialDataTrendChart')?.destroy();
    Chart.getChart('contactDataTrendChart')?.destroy();

    // Recreating charts with new data
    this.createCharts();
  }
}

