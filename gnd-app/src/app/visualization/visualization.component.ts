import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-visualization',
  standalone: true,
  imports: [],
  templateUrl: './visualization.component.html',
  styleUrl: './visualization.component.css'
})
export class VisualizationComponent implements OnInit {
  responseData: any;

  constructor(private router: Router) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.responseData = navigation.extras.state['responseData'];
      this.createCircularBarChart();
    }
  }

  createCircularBarChart() {
    const ctx = document.getElementById('circularBarChart') as HTMLCanvasElement;
    if (this.responseData && ctx) {
      const data = {
        labels: ['NER', 'Personal', 'Financial', 'Contact', 'Medical', 'Ethnic', 'Biometric'],
        datasets: [{
          label: 'Scores',
          data: [
            this.responseData.result.score.NER,
            this.responseData.result.score.Personal,
            this.responseData.result.score.Financial,
            this.responseData.result.score.Contact,
            this.responseData.result.score.Medical,
            this.responseData.result.score.Ethnic,
            this.responseData.result.score.Biometric
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
        indexAxis: 'y' as const,
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
    }
  }
}
