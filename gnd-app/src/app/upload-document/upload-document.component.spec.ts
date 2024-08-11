// import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
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

//   // it('should call onFileSelected and upload file', () => {
//   //   const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
//   //   const input = debugElement.query(By.css('input[type="file"]')).nativeElement;

//   //   spyOn(component, 'onFileSelected').and.callThrough();

//   //   const dataTransfer = new DataTransfer();
//   //   dataTransfer.items.add(file);

//   //   input.files = dataTransfer.files;
//   //   input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

//   //   fixture.detectChanges();

//   //   expect(component.onFileSelected).toHaveBeenCalled();
//   //   expect(component.fileName).toBe('test.txt');

//   //   const req = httpMock.expectOne('http://127.0.0.1:8000/file-upload-new');
//   //   expect(req.request.method).toBe('POST');
//   //   req.flush({ fileName: 'test.txt', result: 'file processed' });

//   //   fixture.detectChanges();

//   //   expect(component.uploadedFileName).toBe('test.txt');
//   //   expect(component.result).toBe('file processed'.replace(/\n/g, '<br>'));
//   // });
//   it('should call onFileSelected and upload file', fakeAsync(() => {
//     const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
//     const input = fixture.debugElement.query(By.css('input[type="file"]')).nativeElement;
  
//     spyOn(component, 'onFileSelected').and.callThrough();
  
//     input.dispatchEvent(new Event('change'));
//     input.files = [file];
  
//     fixture.detectChanges();
//     tick(); 
  
//     expect(component.onFileSelected).toHaveBeenCalled();
//     expect(component.fileName).toBe('test.txt');
  
//     const req = httpMock.expectOne('http://127.0.0.1:8000/file-upload-new');
//     expect(req.request.method).toBe('POST');
//     req.flush({
//       fileName: 'test.txt',
//       result: 'file processed',
//       documentStatus: 'Compliant',
//       nerCount: 5,
//       location: 'New York',
//       personalData: 'Present',
//       financialData: 'Present',
//       contactData: 'Present',
//       medicalData: 'Absent',
//       ethnicData: 'Absent',
//       biometricData: 'Absent',
//       consentAgreement: 'Consent obtained'
//     });
  
//     fixture.detectChanges();
//     tick();
  
//     expect(component.result).toBe('file processed');
//     expect(component.documentStatus).toBe('Compliant');

//   }));

// it('should display the analysis result in the analysis window', () => {
//   const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
//   const input = debugElement.query(By.css('input[type="file"]')).nativeElement;

//   const dataTransfer = new DataTransfer();
//   dataTransfer.items.add(file);

//   input.files = dataTransfer.files;
//   input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));

//   const req = httpMock.expectOne('http://127.0.0.1:8000/file-upload-new');
//   req.flush({ fileName: 'test.txt', result: 'line1\nline2' });

//   fixture.detectChanges();

//   const analysisHeader = debugElement.query(By.css('.analysis-box-header')).nativeElement;
//   const resultContent = debugElement.query(By.css('.result-content')).nativeElement;

//   expect(analysisHeader.textContent).toContain('Analysis Result:');
//   expect(resultContent.innerHTML).toContain('<b>line1</b><br>line2');
// });
// });
