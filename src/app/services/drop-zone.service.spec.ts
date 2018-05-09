import { TestBed, inject } from '@angular/core/testing';

import { DropZoneService } from './drop-zone.service';

describe('DropZoneService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DropZoneService]
    });
  });

  it('should be created', inject([DropZoneService], (service: DropZoneService) => {
    expect(service).toBeTruthy();
  }));
});
