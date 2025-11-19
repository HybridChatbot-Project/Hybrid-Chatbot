import { TestBed } from '@angular/core/testing';

import { CluodinaryService } from './cluodinary.service';

describe('CluodinaryService', () => {
  let service: CluodinaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CluodinaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
