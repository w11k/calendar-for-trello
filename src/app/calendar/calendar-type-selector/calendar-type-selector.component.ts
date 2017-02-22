import {Component, OnInit, EventEmitter} from '@angular/core';
import {CalendarType, SettingsActions} from "../../redux/actions/settings-actions";

export class CalendarTypeSelectEvent {

  constructor(private calendarType: CalendarType) {
  }
}
@Component({
  selector: 'app-calendar-type-selector',
  templateUrl: './calendar-type-selector.component.html',
  styleUrls: ['./calendar-type-selector.component.scss']
})
export class CalendarTypeSelectorComponent implements OnInit {


  selected: string;
  calendarType: CalendarType;
  CalendarType = CalendarType;

  // @Output() switchMode:EventEmitter<CalendarTypeSelectEvent> = new EventEmitter();
  constructor(private settingsActions: SettingsActions) {
  }

  ngOnInit() {
  }

  typesArr: string[] = ["Agenda", "Month", "Week"];

  update(calendarType) {
    console.log(calendarType);

    // this.switchMode.emit(new CalendarTypeSelectEvent(calendarType))

    let type: CalendarType;
    switch (calendarType) {
      case "Agenda":
        type = CalendarType.Agenda
        break;

      case "Week":
        type = CalendarType.Week
        break;

      default:
        type = CalendarType.Month
        break;
    }
    this.settingsActions.changeCalendarType(type)
  }

}
