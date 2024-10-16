import { TestBed } from '@angular/core/testing';

import { EncryptionKeyService } from './encryption-key.service';

describe('EncryptionKeyService', () => {
  let service: EncryptionKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncryptionKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
