import { browser, element, by } from 'protractor/globals';

export class V2CalendarForTrelloPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
