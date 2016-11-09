import {Card} from "./card";


export class CalendarDay {

  constructor(public date: Date,
              public isDayOff?: boolean,
              public isToday?: boolean) {

  }
}
