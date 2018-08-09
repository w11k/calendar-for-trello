import {inject, TestBed} from '@angular/core/testing';

import {TrackingService} from './tracking.service';

describe('TrackingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackingService]
    });
  });

  it('should be created', inject([TrackingService], (service: TrackingService) => {
    expect(service).toBeTruthy();
  }));
});
