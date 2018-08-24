import {CalendarType, WeekStart} from '../redux/actions/settings-actions';

export class Settings {
  public boardColorPrefs: Object = {};
  public boardVisibilityPrefs: Object = {};
  public type: CalendarType = CalendarType.Month;
  public includeDoneCards = true;
  public filterForUser: string = null;
  public showWeekend = false;
  public weekStart: WeekStart = WeekStart.Monday;
  public weekViewShowHours: boolean | undefined = true;
  public businessHoursStart: number | undefined = 9;
  public businessHoursEnd: number | undefined = 18;
  public filterForLabel: string = null;
}
