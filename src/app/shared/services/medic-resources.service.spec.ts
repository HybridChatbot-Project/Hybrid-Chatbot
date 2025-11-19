import { TestBed } from '@angular/core/testing';

import { MedicResourcesService } from './medic-resources.service';

describe('MedicResourcesService', () => {
  let service: MedicResourcesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicResourcesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
