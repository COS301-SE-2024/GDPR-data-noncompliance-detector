// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class VisualizationService {

//   constructor() { }

//   private visualizationData: any;
//   private uploadState: any;
//   private pdfData: any;

//   setData(data: any) {
//     this.visualizationData = data;
//   }

//   getData(): any {
//     return this.visualizationData;
//   }

//   setUploadState(state: any) {
//     this.uploadState = state;
//   }

//   getUploadState() {
//     return this.uploadState;
//   }

//   setPDFState(state: any) {
//     this.pdfData = state;
//   }

//   getPDFState() {
//     return this.pdfData;
//   }
// }

// src/app/services/visualization.service.ts

// src/app/services/scan-data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisualizationService {
  private scanDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  
  constructor() {}

// src/app/services/visualization.service.ts
setScanData(data: any) {
  console.log('VisualizationService: Setting scan data:', data);
  this.scanDataSubject.next(data);
}

getScanData(): Observable<any> {
  console.log('VisualizationService: getScanData called');
  return this.scanDataSubject.asObservable();
}

clearScanData() {
  console.log('VisualizationService: Clearing scan data');
  this.scanDataSubject.next(null);
}

}
