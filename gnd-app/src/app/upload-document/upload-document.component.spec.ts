// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { UploadDocumentComponent } from './upload-document.component';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { DebugElement } from '@angular/core';
// import { By } from '@angular/platform-browser';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { RouterTestingModule } from '@angular/router/testing';
// import { ActivatedRoute } from '@angular/router';
// import { of } from 'rxjs';

// describe('UploadDocumentComponent', () => {
//   let component: UploadDocumentComponent;
//   let fixture: ComponentFixture<UploadDocumentComponent>;
//   let httpMock: HttpTestingController;
//   let debugElement: DebugElement; 

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [RouterTestingModule, HttpClientTestingModule, UploadDocumentComponent],
//       providers: [
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             paramMap: of({
//               get: (key: string) => {
//                 switch(key) {
//                   case 'fileType': return 'someFileType';
//                   default: return null;
//                 }
//               }
//             })
//           }
//         }
//       ],
//       schemas: [NO_ERRORS_SCHEMA]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(UploadDocumentComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//     debugElement = fixture.debugElement;
//     httpMock = TestBed.inject(HttpTestingController);
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   afterEach(() => {
//     httpMock.verify();
//   });

//   it('should call onFileSelected and upload file', () => {
//     const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
//     const input = debugElement.query(By.css('input[type="file"]')).nativeElement;

//     spyOn(component, 'onFileSelected').and.callThrough();

//     const dataTransfer = new DataTransfer();
//     dataTransfer.items.add(file);

//     input.files = dataTransfer.files;
//     input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

//     fixture.detectChanges();

//     expect(component.onFileSelected).toHaveBeenCalled();
//     expect(component.fileName).toBe('test.txt');

//     const req = httpMock.expectOne('http://127.0.0.1:8000/file-upload');
//     expect(req.request.method).toBe('POST');
//     req.flush({ fileName: 'test.txt', result: 'file processed' });

//     fixture.detectChanges();

//     expect(component.uploadedFileName).toBe('test.txt');
//     expect(component.result).toBe('file processed'.replace(/\n/g, '<br>'));
//   });

// //   it('should display the analysis result in the analysis window', () => {
// //     const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
// //     const input = debugElement.query(By.css('input[type="file"]')).nativeElement;

// //     const dataTransfer = new DataTransfer();
// //     dataTransfer.items.add(file);

// //     input.files = dataTransfer.files;
// //     input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

// //     const req = httpMock.expectOne('http://127.0.0.1:8000/file-upload');
// //     req.flush({ fileName: 'test.txt', result: 'line1\nline2' });

// //     fixture.detectChanges();

// //     const analysisHeader = debugElement.query(By.css('.analysis-box-header')).nativeElement;
// //     const resultContent = debugElement.query(By.css('.result-content')).nativeElement;

// //     expect(analysisHeader.textContent).toContain('Analysis Result:');
// //     expect(resultContent.innerHTML).toContain('line1<br>line2');
// //   });
// // });
// it('should display the analysis result in the analysis window', () => {
//   const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
//   const input = debugElement.query(By.css('input[type="file"]')).nativeElement;

//   const dataTransfer = new DataTransfer();
//   dataTransfer.items.add(file);

//   input.files = dataTransfer.files;
//   input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

//   const req = httpMock.expectOne('http://127.0.0.1:8000/file-upload');
//   req.flush({ fileName: 'test.txt', result: 'line1\nline2' });

//   fixture.detectChanges();

//   const analysisHeader = debugElement.query(By.css('.analysis-box-header')).nativeElement;
//   const resultContent = debugElement.query(By.css('.result-content')).nativeElement;

//   expect(analysisHeader.textContent).toContain('Analysis Result:');
//   expect(resultContent.innerHTML).toContain('<b>line1</b><br>line2');
// });
// });
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadDocumentComponent } from './upload-document.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { WalkthroughService } from '../services/walkthrough.service';

describe('UploadDocumentComponent', () => {
  let component: UploadDocumentComponent;
  let fixture: ComponentFixture<UploadDocumentComponent>;
  let httpMock: HttpTestingController;
  let debugElement: DebugElement;
  let walkthroughServiceMock: jasmine.SpyObj<WalkthroughService>;

  beforeEach(async () => {
    walkthroughServiceMock = jasmine.createSpyObj('WalkthroughService', ['walkthroughRequested$']);
    walkthroughServiceMock.walkthroughRequested$ = of(undefined);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, UploadDocumentComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => {
                switch(key) {
                  case 'fileType': return 'someFileType';
                  default: return null;
                }
              }
            })
          }
        },
        { provide: WalkthroughService, useValue: walkthroughServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call onFileSelected and upload file', () => {
    const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    const input = debugElement.query(By.css('input[type="file"]')).nativeElement;

    spyOn(component, 'onFileSelected').and.callThrough();

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    input.files = dataTransfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

    fixture.detectChanges();

    expect(component.onFileSelected).toHaveBeenCalled();
    expect(component.fileName).toBe('test.txt');

    const req = httpMock.expectOne('http://127.0.0.1:8000/file-upload-new');
    expect(req.request.method).toBe('POST');
    req.flush({
      fileName: 'test.txt',
      result: {
        score: {
          Status: 1,
          NER: 5,
          location: 1,
          Personal: 3,
          Financial: 2,
          Contact: 1,
          Medical: 0,
          Ethnic: 0,
          Biometric: 0,
          "Consent Agreement": true
        }
      }
    });

    fixture.detectChanges();

    expect(component.uploadedFileName).toBe('test.txt');
    expect(component.result).toBe('Y');
    expect(component.documentStatus).toBe('Compliant');
    expect(component.nerCount).toBe(5);
    expect(component.location).toBe('EU');
    expect(component.personalData).toBe(3);
    expect(component.financialData).toBe(2);
    expect(component.contactData).toBe(1);
    expect(component.medicalData).toBe(0);
    expect(component.ethnicData).toBe(0);
    expect(component.biometricData).toBe(0);
    expect(component.consentAgreement).toBe('This document does appear to contain data consent agreements');
  });

  it('should display the analysis result in the analysis window', () => {
    component.result = 'Y';
    component.documentStatus = 'Compliant';
    component.nerCount = 5;
    component.location = 'EU';
    component.personalData = 3;
    component.financialData = 2;
    component.contactData = 1;
    component.medicalData = 0;
    component.ethnicData = 0;
    component.biometricData = 0;
    component.consentAgreement = 'This document does appear to contain data consent agreements';

    fixture.detectChanges();

    const analysisHeader = debugElement.query(By.css('.analysis-header')).nativeElement;
    const nerData = debugElement.query(By.css('.ner-data')).nativeElement;
    const locationData = debugElement.query(By.css('.result-data:nth-child(2)')).nativeElement;
    const personalDataElement = debugElement.query(By.css('.result-data:nth-child(4)')).nativeElement;
    const consentStatus = debugElement.query(By.css('.consent-status')).nativeElement;

    expect(analysisHeader.textContent).toContain('Analysis');
    expect(nerData.textContent).toContain('This document potentially references 5 different individuals');
    expect(locationData.textContent).toContain('Location:EU');
    expect(personalDataElement.textContent).toContain('Personal Data:3');
    expect(consentStatus.textContent).toContain('This document does appear to contain data consent agreements');
  });

  it('should initialize intro.js on ngOnInit if hasSeenIntro is not set', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    spyOn(component, 'startIntro');

    component.ngOnInit();

    expect(localStorage.getItem).toHaveBeenCalledWith('hasSeenIntro');
    expect(component.startIntro).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith('hasSeenIntro', 'true');
  });

  it('should not initialize intro.js on ngOnInit if hasSeenIntro is set', () => {
    spyOn(localStorage, 'getItem').and.returnValue('true');
    spyOn(component, 'startIntro');

    component.ngOnInit();

    expect(localStorage.getItem).toHaveBeenCalledWith('hasSeenIntro');
    expect(component.startIntro).not.toHaveBeenCalled();
  });

  it('should call startIntro when toggleWalkthrough is called', () => {
    spyOn(component, 'startIntro');

    component.toggleWalkthrough();

    expect(component.startIntro).toHaveBeenCalled();
  });
});