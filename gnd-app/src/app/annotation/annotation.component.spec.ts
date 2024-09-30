// annotation.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnotationComponent } from './annotation.component';
import { VisualizationService } from '../services/visualization.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

describe('AnnotationComponent', () => {
  let component: AnnotationComponent;
  let fixture: ComponentFixture<AnnotationComponent>;
  let mockVisualizationService: jasmine.SpyObj<VisualizationService>;
  let mockSanitizer: jasmine.SpyObj<DomSanitizer>;
  let mockRouter: jasmine.SpyObj<Router>;

  const fixedBlobUrl = 'blob:http://localhost:9876/test-url';

  beforeEach(async () => {
    //spies
    mockVisualizationService = jasmine.createSpyObj('VisualizationService', ['getUploadState']);
    mockSanitizer = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    const mockData = {
      score: {
        ner_result_text: btoa('Sample PDF content') //encode sample string
      }
    };
    mockVisualizationService.getUploadState.and.returnValue(mockData);
    mockSanitizer.bypassSecurityTrustResourceUrl.and.callFake((url: string) => url as SafeResourceUrl);

    spyOn(URL, 'createObjectURL').and.returnValue(fixedBlobUrl);

    await TestBed.configureTestingModule({
      imports: [AnnotationComponent],
      providers: [
        { provide: VisualizationService, useValue: mockVisualizationService },
        { provide: DomSanitizer, useValue: mockSanitizer },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnotationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getUploadState from VisualizationService', () => {
      component.ngOnInit();
      expect(mockVisualizationService.getUploadState).toHaveBeenCalled();
    });

    it('should set encoded_value correctly from received data', () => {
      component.ngOnInit();
      expect(component.encoded_value).toBe(btoa('Sample PDF content'));
    });

    it('should generate and sanitize pdfUrl correctly', () => {
      component.ngOnInit();

      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(mockSanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(fixedBlobUrl);
      expect(component.pdfUrl).toBe(fixedBlobUrl as SafeResourceUrl);
    });
  });

  describe('onBack', () => {
    it('should navigate to /upload', () => {
      component.onBack();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/upload']);
    });
  });
});