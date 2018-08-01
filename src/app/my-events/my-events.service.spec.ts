import {TestBed, inject} from '@angular/core/testing';

import {MyEventsService} from './my-events.service';

describe('MyEventsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyEventsService]
    });
  });

  it('should be created', inject([MyEventsService], (service: MyEventsService) => {
    expect(service).toBeTruthy();
  }));
});
