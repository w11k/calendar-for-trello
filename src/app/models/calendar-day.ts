export class CalendarDay {
  date: Date;

  constructor(date: Date,
              public isDayOff?: boolean,
              public isToday?: boolean) {

    this.date = new Date(date);

  }
}
