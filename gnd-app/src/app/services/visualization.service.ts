import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VisualizationService {

  constructor() { }

  private visualizationData: any;

  setData(data: any) {
    this.visualizationData = data;
  }

  getData(): any {
    return this.visualizationData;
  }
}
