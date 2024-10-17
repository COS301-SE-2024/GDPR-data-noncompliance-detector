import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadDocumentComponent } from './upload-document.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WalkthroughService } from '../services/walkthrough.service';
import { VisualizationService } from '../services/visualization.service';
import { of, Subject } from 'rxjs';
import * as CryptoJS from 'crypto-js';

describe('UploadDocumentComponent', () => {
  let component: UploadDocumentComponent;
  let fixture: ComponentFixture<UploadDocumentComponent>;
  let httpTestingController: HttpTestingController;
  let visualizationServiceSpy: jasmine.SpyObj<VisualizationService>;
  let walkthroughServiceSpy: jasmine.SpyObj<WalkthroughService>;

  beforeEach(async () => {
    const visualizationSpy = jasmine.createSpyObj('VisualizationService', ['getUploadState', 'setUploadState', 'setData', 'setPDFState']);
    const walkthroughSpy = jasmine.createSpyObj('WalkthroughService', ['walkthroughRequested$']);

    walkthroughSpy.walkthroughRequested$ = new Subject<void>();

    await TestBed.configureTestingModule({
      imports: [UploadDocumentComponent, HttpClientTestingModule],
      providers: [
        { provide: WalkthroughService, useValue: walkthroughSpy },
        { provide: VisualizationService, useValue: visualizationSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadDocumentComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    visualizationServiceSpy = TestBed.inject(VisualizationService) as jasmine.SpyObj<VisualizationService>;
    walkthroughServiceSpy = TestBed.inject(WalkthroughService) as jasmine.SpyObj<WalkthroughService>;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should process a file dropped and call the API', () => {
    const mockFile = new File(['sample text'], 'sample.txt', { type: 'text/plain' });
  
    const mockDragEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
      dataTransfer: {
        files: [mockFile]
      }
    } as unknown as DragEvent;
  
    spyOn(component, 'onFileDropped').and.callThrough();
  
    component.onFileDropped(mockDragEvent);
    expect(component.onFileDropped).toHaveBeenCalled();
  
    const req = httpTestingController.expectOne('http://127.0.0.1:8000/file-upload-new');
    expect(req.request.method).toEqual('POST');
  }); 

  it('should activate drag state on dragover', () => {
    const dragEvent = new DragEvent('dragover');
    component.onDragOver(dragEvent);
    expect(component.isDragActive).toBeTrue();
  });

  it('should deactivate drag state on dragleave', () => {
    const dragEvent = new DragEvent('dragleave');
    component.onDragLeave(dragEvent);
    expect(component.isDragActive).toBeFalse();
  });

  it('should correctly calculate the metric score', () => {
    component.personal = 10;
    component.financialData = 5;
    component.contactData = 3;
    component.medicalData = 7;
    component.genetic_data = 4;
    component.ethnicData = 2;
    component.biometricData = 8;

    spyOn(Math, 'exp').and.callFake((x) => x);

    component.calculateMetric();

    expect(component.metric_score).toBeDefined();
  });

  it('should trigger walkthrough if user has not seen it', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    spyOn(component, 'startIntro');

    component.ngOnInit();
    expect(component.startIntro).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith('hasSeenIntro', 'true');
  });

  it('should subscribe to walkthroughService', () => {
    const walkthroughServiceSubject = new Subject<void>();
    walkthroughServiceSpy.walkthroughRequested$ = walkthroughServiceSubject.asObservable();

    spyOn(component, 'startIntro');
    component.ngOnInit();

    walkthroughServiceSubject.next();
    expect(component.startIntro).toHaveBeenCalled();
  });

  it('should clear analysis when clearAnalysis is called', () => {
    component.response = { data: 'sample' };
    component.documentStatus = 'Non-Compliant';
    component.nerCount = 5;

    component.clearAnalysis();

    expect(component.response).toBeNull();
    expect(component.documentStatus).toEqual('');
    expect(component.nerCount).toEqual(0);
  });

  it('should handle API error gracefully on upload', () => {
    const mockFile = new File(['sample text'], 'sample.txt', { type: 'text/plain' });
  
    const mockDragEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
      dataTransfer: {
        files: [mockFile]
      }
    } as unknown as DragEvent;
  
    spyOn(window, 'alert').and.callFake(() => {});
  
    component.onFileDropped(mockDragEvent);
  
    const req = httpTestingController.expectOne('http://127.0.0.1:8000/file-upload-new');
    req.flush({}, { status: 500, statusText: 'Server Error' });
  
    expect(window.alert).toHaveBeenCalledWith(
      "Cannot process File. Please try again.\nEnsure the file type meets the required format."
    );
  });
});

