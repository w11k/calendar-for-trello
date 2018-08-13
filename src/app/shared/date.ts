import {setHours, setMinutes, setSeconds} from 'date-fns';

export function setTime(date: Date, hours: number, minutes: number, seconds: number): Date {
  return setHours(setMinutes(setSeconds(date, seconds), minutes), hours);
}
