import {TestBed, inject} from '@angular/core/testing';

import {ConversationsService} from './conversations.service';

describe('ConversationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConversationsService]
    });
  });

  it('should be created', inject([ConversationsService], (service: ConversationsService) => {
    expect(service).toBeTruthy();
  }));
});
