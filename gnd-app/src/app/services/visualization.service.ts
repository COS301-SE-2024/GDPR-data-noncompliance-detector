import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VisualizationService {

  constructor() { }

  private visualizationData: any;
  private uploadState: any;
  private pdfData: any;

  setData(data: any) {
    this.visualizationData = data;
  }

  getData(): any {
    return this.visualizationData;
  }

  setUploadState(state: any) {
    this.uploadState = state;
  }

  getUploadState() {
    return this.uploadState;
  }

  setPDFState(state: any) {
    this.pdfData = state;
  }

  getPDFState() {
    return this.pdfData;
  }
}
