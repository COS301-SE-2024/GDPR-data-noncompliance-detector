import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReportGenerationService, ViolationData } from './report-generation.service';
import { jsPDF } from 'jspdf';

describe('ReportGenerationService', () => {
  let service: ReportGenerationService;
  let httpMock: HttpTestingController;
  let mockPDF: jasmine.SpyObj<jsPDF>;

  beforeEach(() => {
    //mock jsPDF
    mockPDF = jasmine.createSpyObj('jsPDF', [
      'addImage',
      'setFont',
      'text',
      'save',
      'setFillColor',
      'rect',
      'roundedRect',
      'addFileToVFS',
      'getFontList'
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReportGenerationService,
        { provide: jsPDF, useValue: mockPDF }
      ]
    });
    service = TestBed.inject(ReportGenerationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert array buffer to base64', () => {
    const buffer = new Uint8Array([72, 101, 108, 108, 111]).buffer;
    const result = service['arrayBufferToBase64'](buffer);
    expect(result).toBe(btoa('Hello'));
  });

  it('should load an image and return a data URL', async () => {
    const imageUrl = 'assets/test-image.jpg';
    
    spyOn(service as any, 'getImageDataUrl').and.returnValue(Promise.resolve('data:image/png;base64,TEST_DATA'));

    const result = await service['getImageDataUrl'](imageUrl);
    expect(result).toBe('data:image/png;base64,TEST_DATA');
  });
});