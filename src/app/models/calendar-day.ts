import {Card} from './card';

export class CalendarDay {

  cards?: Card[];

  constructor(public date: Date,
              public isDayOff?: boolean,
              public isToday?: boolean) {

  }
}
