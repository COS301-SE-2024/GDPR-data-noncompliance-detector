import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadDocumentComponent } from './upload-document.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('UploadDocumentComponent', () => {
  let component: UploadDocumentComponent;
  let fixture: ComponentFixture<UploadDocumentComponent>;
  let httpMock: HttpTestingController;
  let debugElement: DebugElement; 

  beforeEach(async () => {
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
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

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
    
    const mockResponse = {
      fileName: 'test.txt',
      result: {
        score: {
          Status: 1,
          NER: 5,
          location: 2,
          Personal: 3,
          Financial: 4,
          Contact: 5,
          Medical: 6,
          Ethnic: 7,
          Biometric: 8,
          "Consent Agreement": true
        }
      }
    };
    
    req.flush(mockResponse);
  
    fixture.detectChanges();
  
    expect(component.uploadedFileName).toBe('test.txt');
    expect(component.documentStatus).toBe(component.docStatus(mockResponse.result.score.Status));
    expect(component.nerCount).toBe(mockResponse.result.score.NER);
    expect(component.location).toBe(component.locationStatus(mockResponse.result.score.location));
    expect(component.personalData).toBe(mockResponse.result.score.Personal);
    expect(component.financialData).toBe(mockResponse.result.score.Financial);
    expect(component.contactData).toBe(mockResponse.result.score.Contact);
    expect(component.medicalData).toBe(mockResponse.result.score.Medical);
    expect(component.ethnicData).toBe(mockResponse.result.score.Ethnic);
    expect(component.biometricData).toBe(mockResponse.result.score.Biometric);
    expect(component.consentAgreement).toBe(component.consentAgreementStatus(mockResponse.result.score["Consent Agreement"]));
    expect(component.result).toBe('Y');
  });
it('should display the analysis result in the analysis window', () => {
  const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
  const input = debugElement.query(By.css('input[type="file"]')).nativeElement;

  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);

  input.files = dataTransfer.files;
  input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

  const req = httpMock.expectOne('http://127.0.0.1:8000/file-upload');
  req.flush({ fileName: 'test.txt', result: 'line1\nline2' });

  fixture.detectChanges();

  const analysisHeader = debugElement.query(By.css('.analysis-box-header')).nativeElement;
  const resultContent = debugElement.query(By.css('.result-content')).nativeElement;

  expect(analysisHeader.textContent).toContain('Analysis Result:');
  expect(resultContent.innerHTML).toContain('<b>line1</b><br>line2');
});
});
