// -> Takes previous state + action, returnes new // new state
import {CalendarActions, CalendarType} from '../actions/calendar-actions';
import {CalendarDay} from "../../models/calendar-day";
import {Moment} from "moment";
import * as moment from "moment";

export interface CalendarState {
  days: CalendarDay[];
  date: Moment;
  type: CalendarType;
}

export default (state: CalendarState = {days: [], date: moment(), type: CalendarType.Month}, action: any) => {
  switch (action.type) {
    case CalendarActions.BUILD_DAYS:
      return {
        days: action.payload,
        date: action.date,
        type: action.CalendarType ? action.CalendarType : state.type,
      };
    case CalendarActions.CHANGE_TYPE:
      return Object.assign({}, state, {type: state.type === CalendarType.Month ? CalendarType.Week : CalendarType.Month});
    default:
      return state;
  }
}
