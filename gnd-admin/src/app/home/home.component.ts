import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import {FormsModule, NgModel} from "@angular/forms";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  timeRange: string = '7d';
  violationTrends: any[] = [
    { date: '2024-08-26', count: 15 },
    { date: '2024-08-27', count: 20 },
    { date: '2024-08-28', count: 18 },
    { date: '2024-08-29', count: 25 },
    { date: '2024-08-30', count: 22 },
    { date: '2024-08-31', count: 30 },
    { date: '2024-09-01', count: 28 },
  ];
  violationTypes: any[] = [
    { name: 'Personal Data Breach', value: 35 },
    { name: 'Consent Violation', value: 25 },
    { name: 'Data Retention', value: 20 },
    { name: 'Other', value: 20 },
  ];

  ngOnInit() {
    this.createViolationTrendChart();
    this.createViolationTypesChart();
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
}
