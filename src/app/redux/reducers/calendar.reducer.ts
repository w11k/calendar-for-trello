// -> Takes previous state + action, returnes new // new state
import {CalendarActions} from '../actions/calendar-actions';
import {CalendarDay} from '../../models/calendar-day';
import {CalendarType} from '../actions/settings-actions';

export interface CalendarState {
  days: CalendarDay[];
  date: Date;
}

const initialState = {days: [], date: new Date(), type: CalendarType.Month};


export default (state: CalendarState = initialState, action: any) => {
  switch (action.type) {
    case CalendarActions.BUILD_DAYS:
      return {
        days: action.payload,
        date: action.date,
      };
    case CalendarActions.RESET_CALENDAR_STORE:
      return initialState;
    default:
      return state;
  }
};
