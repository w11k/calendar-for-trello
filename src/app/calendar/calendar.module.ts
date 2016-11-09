import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarComponent} from './calendar.component';
import {NoDueAreaComponent} from "./no-due-area/no-due-area.component";
import {CalendarDayForMonthComponent} from "./calendar-day-month/calendar-day-month.component";
import {CalendarCardComponent} from "./calendar-card/calendar-card.component";
import {OverDueAreaComponent} from "./over-due-area/over-due-area.component";
import {CalendarFooterComponent} from "./calendar-footer/calendar-footer.component";
import {CalendarToolbarComponent} from "./calendar-toolbar/calendar-toolbar.component";
import {CalendarDayForWeekComponent} from "./calendar-day-week/calendar-day-week.component";
import {DndModule} from "ng2-dnd";
import {FormsModule} from "@angular/forms";
import {AddCardComponent} from "./add-card/add-card.component";

@NgModule({
  imports: [
    CommonModule,
    DndModule,
    FormsModule
  ],
  declarations: [CalendarComponent,
    CalendarDayForMonthComponent,
    CalendarCardComponent,
    OverDueAreaComponent,
    CalendarDayForWeekComponent,
    CalendarFooterComponent,
    CalendarToolbarComponent,
    AddCardComponent,
    NoDueAreaComponent],
  exports: [
    CalendarCardComponent,
    AddCardComponent
  ]
})
export class CalendarModule {
}
