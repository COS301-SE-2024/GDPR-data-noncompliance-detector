// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { VisualizationComponent } from './visualization.component';
// import { VisualizationService } from '../services/visualization.service';
// import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';

// describe('VisualizationComponent', () => {
//   let component: VisualizationComponent;
//   let fixture: ComponentFixture<VisualizationComponent>;
//   let visualizationService: jasmine.SpyObj<VisualizationService>;

//   beforeEach(async () => {
//     const spy = jasmine.createSpyObj('VisualizationService', ['getData']);

//     await TestBed.configureTestingModule({
//       imports: [VisualizationComponent],
//       providers: [
//         { provide: VisualizationService, useValue: spy }
//       ],
//       schemas: [NO_ERRORS_SCHEMA]
//     })
//     .compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(VisualizationComponent);
//     component = fixture.componentInstance;
//     visualizationService = TestBed.inject(VisualizationService) as jasmine.SpyObj<VisualizationService>;
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should get data from VisualizationService on init', () => {
//     const mockData = {
//       score: {
//         NER: 5,
//         location_report: 2,
//         Personal: 7,
//         Financial: 19,
//         Contact: 21,
//         Medical: 14,
//         Ethnic: 8,
//         Biometric: 6,
//         Genetic: 6,
//         lenarts: 0,
//         RAG_Statement: 'Good'
//       }
//     };
//     visualizationService.getScanData.and.returnValue(mockData);
    
//     component.ngOnInit();

//     expect(component.data).toEqual(mockData);
//     expect(component.nerCount).toEqual(mockData.score.NER);
//     expect(component.location).toEqual(mockData.score.location_report);
//     expect(component.personalData).toEqual(mockData.score.Personal);
//     expect(component.financialData).toEqual(mockData.score.Financial);
//     expect(component.contactData).toEqual(mockData.score.Contact);
//     expect(component.medicalData).toEqual(mockData.score.Medical);
//     expect(component.ethnicData).toEqual(mockData.score.Ethnic);
//     expect(component.biometricData).toEqual(mockData.score.Biometric);
//     expect(component.geneticData).toEqual(mockData.score.Genetic);
//     expect(component.rag_count).toEqual(mockData.score.lenarts);
//     expect(component.rag_stat).toEqual(mockData.score.RAG_Statement);
//   });

//   it('should call createCircularBarChart after ngOnInit', () => {
//     spyOn(component, 'createCircularBarChart');
    
//     const mockData = { score: { /* Mock data as above */ } };
//     visualizationService.getData.and.returnValue(mockData);
    
//     component.ngOnInit();

//     expect(component.createCircularBarChart).toHaveBeenCalled();
//   });

//   it('should initialize the canvas elements in ngAfterViewInit', () => {
//     // Mock canvas elements
//     component.progressCanvas = { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>;
//     component.radarChartCanvas = { nativeElement: document.createElement('canvas') } as ElementRef<HTMLCanvasElement>;
    
//     spyOn(component, 'drawCircularProgressBar');
//     spyOn(component, 'calculateMetric');

//     component.ngAfterViewInit();

//     expect(component.drawCircularProgressBar).toHaveBeenCalledWith(component.rag_count);
//     expect(component.calculateMetric).toHaveBeenCalled();
//   });
// });
