import {Card} from "./card";


export class CalendarDay {

  constructor(public date: Date,
              public cards: Card[] = []) {

    this.cards = [new Card("1", "1"), new Card("2", "2"), new Card("3", "3"), new Card("4", "4")];
  }
}
