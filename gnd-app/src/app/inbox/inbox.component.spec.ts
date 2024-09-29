// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { InboxComponent } from './inbox.component';

// describe('InboxComponent', () => {
//   let component: InboxComponent;
//   let fixture: ComponentFixture<InboxComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [InboxComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(InboxComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InboxComponent } from './inbox.component';
import { WalkthroughService } from '../services/walkthrough.service';
import { ReportGenerationService } from '../services/report-generation.service';
import { of } from 'rxjs';

describe('InboxComponent', () => {
  let component: InboxComponent;
  let fixture: ComponentFixture<InboxComponent>;
  let httpMock: HttpTestingController;
  let mockWalkthroughService: Partial<WalkthroughService>;
  let mockReportGenerationService: Partial<ReportGenerationService>;

  beforeEach(async () => {
    mockWalkthroughService = {
      walkthroughRequested$: of()
    };

    mockReportGenerationService = {
      generatePDF: jasmine.createSpy('generatePDF')
    };

    await TestBed.configureTestingModule({
      imports: [
        InboxComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: WalkthroughService, useValue: mockWalkthroughService },
        { provide: ReportGenerationService, useValue: mockReportGenerationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InboxComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    
    fixture.detectChanges();

    const req1 = httpMock.expectOne('http://127.0.0.1:8000/get-data-downloads-folder');
    expect(req1.request.method).toBe('GET');
    req1.flush({ outlook_data_folder: 'test/folder' });

    const req2 = httpMock.expectOne('http://127.0.0.1:8000/downloads-results');
    expect(req2.request.method).toBe('GET');
    req2.flush([]);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch data folder on init', () => {
    expect(component.path).toBe('test/folder');
    expect(component.reports).toEqual([]);
  });

  it('should format date correctly', () => {
    const today = new Date();
    expect(component.formatDate(today)).toMatch(/^\d{2}:\d{2}$/);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    expect(component.formatDate(yesterday)).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  it('should determine document status correctly', () => {
    expect(component.docStatus(0.5)).toBe('Compliant');
    expect(component.docStatus(0.7)).toBe('Non-Compliant');
  });

  it('should get file name without country', () => {
    expect(component.getFileNameWithoutCountry('Report - USA.pdf')).toBe('Report');
  });

  it('should determine consent agreement status', () => {
    expect(component.consentAgreementStatus(true)).toBe('The document does appear to contain data consent agreements');
    expect(component.consentAgreementStatus(false)).toBe('The document does not seem to contain any data consent agreements');
  });

  it('should clear analysis', () => {
    component.currentAnalysis = { someData: 'test' };
    component.currentEmail = 'test@example.com';
    component.currentEmailType = 'pdf';

    component.clearAnalysis();

    expect(component.currentAnalysis).toEqual({});
    expect(component.currentEmail).toBe('');
    expect(component.currentEmailType).toBe('');
  });

  it('should get report content correctly', fakeAsync(() => {
    const filePath = 'test/path/report.pdf';
    
    spyOn(console, 'log');
    
    component.getReportContent(filePath);
    
    const req = httpMock.expectOne('http://127.0.0.1:8000/read-downloads-results');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ path: filePath });

    const mockResponse = {
      content: "{ 'result': { 'score': { 'Status': 0.5, 'NER': 10, 'Personal': 5, 'Financial': 2, 'Contact': 1, 'Medical': 0, 'Ethnic': 0, 'Biometric': 0, 'Genetic': 0, 'Consent Agreement': true, 'RAG_Statement': 'Green' } } }"
    };
    req.flush(mockResponse);
    
    tick();
    expect(component.documentStatus).toBe('Compliant');
    expect(component.nerCount).toBe(10);
    expect(component.personalData).toBe(5);
    expect(component.financialData).toBe(2);
    expect(component.contactData).toBe(1);
    expect(component.medicalData).toBe(0);
    expect(component.ethnicData).toBe(0);
    expect(component.biometricData).toBe(0);
    expect(component.geneticData).toBe(0);
    expect(component.consentAgreement).toBe('The document does appear to contain data consent agreements');
    expect(component.ragScore).toBe('Green');
    expect(component.result).toBe('Y');
  }));
});