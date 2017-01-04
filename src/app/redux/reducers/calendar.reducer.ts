// -> Takes previous state + action, returnes new // new state
import {CalendarActions} from '../actions/calendar-actions';
import {CalendarDay} from "../../models/calendar-day";
import {Moment} from "moment";
import * as moment from "moment";
import {CalendarType} from "../actions/settings-actions";

export interface CalendarState {
  days: CalendarDay[];
  date: Moment;
}
const initialState = {days: [], date: moment(), type: CalendarType.Month};


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
}
