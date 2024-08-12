import { TestBed } from '@angular/core/testing';

import { WalkthroughService } from './walkthrough.service';

describe('WalkthroughService', () => {
  let service: WalkthroughService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalkthroughService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
