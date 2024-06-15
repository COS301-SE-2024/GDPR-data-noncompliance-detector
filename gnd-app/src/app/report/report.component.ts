import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-report',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {

  onAnalysisClick() {
    // Handle Analysis button click here
  }

  onViolationsClick() {
    // Handle Violations button click here

  }

  onDownloadReportClick() {
    // Handle Download Report button click here
  }
}
