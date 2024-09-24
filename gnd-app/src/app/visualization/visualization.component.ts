import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VisualizationService } from '../services/visualization.service';
@Component({
  selector: 'app-visualization',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})
export class VisualizationComponent implements OnInit {

  @Input() data: any;

  nerCount: number = 5;
  location: string = "";
  personalData: number = 7;
  financialData: number =19;
  contactData: number = 21;
  medicalData: number = 14;
  ethnicData: number = 8;
  biometricData: number = 6;
  geneticData: number = 6;

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
      this.createCircularBarChart()
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
}