import {CalendarForTrelloPage} from './app.po';

describe('calendar-for-trello App', function () {
  let page: CalendarForTrelloPage;

  beforeEach(() => {
    page = new CalendarForTrelloPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
