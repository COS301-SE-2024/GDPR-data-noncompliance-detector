import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-visualization',
  standalone: true,
  imports: [],
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})
export class VisualizationComponent implements OnInit {
  nerCount: number = 5;
  location: string = "";
  personalData: number = 7;
  financialData: number =19;
  contactData: number = 21;
  medicalData: number = 14;
  ethnicData: number = 8;
  biometricData: number = 6;

  constructor(private router: Router) {
    // Register Chart.js components
    Chart.register(...registerables);
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation.extras.state as {
        nerCount: number,
        location: string,
        personalData: number,
        financialData: number,
        contactData: number,
        medicalData: number,
        ethnicData: number,
        biometricData: number
      };

      this.nerCount = state.nerCount;
      this.location = state.location;
      this.personalData = state.personalData;
      this.financialData = state.financialData;
      this.contactData = state.contactData;
      this.medicalData = state.medicalData;
      this.ethnicData = state.ethnicData;
      this.biometricData = state.biometricData;

      console.log('Received data:', state);  // Debugging log
      this.createCircularBarChart();
    }
  }

  createCircularBarChart() {
    const ctx = document.getElementById('circularBarChart') as HTMLCanvasElement;
    if (ctx) {
      const data = {
        labels: ['NER', 'Personal', 'Financial', 'Contact', 'Medical', 'Ethnic', 'Biometric'],
        datasets: [{
          label: 'Scores',
          data: [
            this.nerCount,
            this.personalData,
            this.financialData,
            this.contactData,
            this.medicalData,
            this.ethnicData,
            this.biometricData
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
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
}