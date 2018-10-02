import {CalendarDay} from '../../models/calendar-day';
import {Card} from '../../models/card';
export class WeekDaySlot {
  constructor(public time: string, // <- currently localized
              public cards?: Card[],
              public calendarDay?: CalendarDay,
              public hours?: number) {

  }
}
