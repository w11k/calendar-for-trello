import {CalendarType, WeekStart} from '../redux/actions/settings-actions';

export class Settings {
  public boardColorPrefs: Object = {};
  public boardVisibilityPrefs: Object = {};
  public language: string = 'en';
  public type: CalendarType = CalendarType.Month;
  public includeDoneCards: boolean = true;
  public filterForUser: string = null;
  public showMembers: boolean = false;
  public weekStart: WeekStart = WeekStart.Monday;
  public weekViewShowHours: boolean | undefined = true;
  public weekDays: number | undefined = 5;
  public businessHoursStart: number | undefined = 9;
  public businessHoursEnd: number | undefined = 18;
  public filterForLabel: string = null;
}
