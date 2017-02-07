import {CalendarType} from "../redux/actions/settings-actions";
export class Settings {
  public boardColorPrefs: Object = {};
  public boardVisibilityPrefs: Object = {};
  public language: string = "en";
  public type: CalendarType = CalendarType.Month;
  public includeDoneCards: boolean = true;
  public filterForUser: string = null;
  public showMembers: boolean = false;
}
