// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { UploadDocumentComponent } from './upload-document.component';

// describe('UploadDocumentComponent', () => {
//   let component: UploadDocumentComponent;
//   let fixture: ComponentFixture<UploadDocumentComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [UploadDocumentComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(UploadDocumentComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UploadDocumentComponent } from './upload-document.component';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('UploadDocumentComponent', () => {
  let component: UploadDocumentComponent;
  let fixture: ComponentFixture<UploadDocumentComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UploadDocumentComponent,
        HttpClientTestingModule, // Mock HttpClient
        CommonModule,
        RouterModule.forRoot([]), // Provide RouterModule
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadDocumentComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify(); // Verify that no unmatched requests are outstanding.
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send file on file selected', () => {
    const mockFile = new File([''], 'test-file.txt');
    const mockEvent = { target: { files: [mockFile] } };
    component.onFileSelected(mockEvent as any);

    const req = httpTestingController.expectOne('http://127.0.0.1:8000/file-upload');
    expect(req.request.method).toEqual('POST');
    req.flush({ fileName: 'test-file.txt', result: 'some-result' }); // Simulate successful response

    // Additional assertions can be made here, for example, checking if component variables are set correctly after the response.
  });

  // Additional tests can be added here
});