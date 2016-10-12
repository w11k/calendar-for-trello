import { V2CalendarForTrelloPage } from './app.po';

describe('v2-calendar-for-trello App', function() {
  let page: V2CalendarForTrelloPage;

  beforeEach(() => {
    page = new V2CalendarForTrelloPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
