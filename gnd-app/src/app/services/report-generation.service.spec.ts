import { TestBed } from '@angular/core/testing';

import { ReportGenerationService } from './report-generation.service';

describe('ReportGenerationService', () => {
  let service: ReportGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportGenerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
