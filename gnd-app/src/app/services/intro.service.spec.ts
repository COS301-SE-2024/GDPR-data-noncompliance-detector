import { TestBed } from '@angular/core/testing';

import { IntroService } from './intro.service';

describe('IntroService', () => {
  let service: IntroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
