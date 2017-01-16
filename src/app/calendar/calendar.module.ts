import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarComponent} from './calendar.component';
import {NoDueAreaComponent} from "./no-due-area/no-due-area.component";
import {CalendarDayForMonthComponent} from "./calendar-day-month/calendar-day-month.component";
import {CalendarCardComponent} from "./calendar-card/calendar-card.component";
import {OverDueAreaComponent} from "./over-due-area/over-due-area.component";
import {CalendarFooterComponent} from "./calendar-footer/calendar-footer.component";
import {CalendarToolbarComponent} from "./calendar-toolbar/calendar-toolbar.component";
import {DndModule} from "ng2-dnd";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AddCardComponent} from "./add-card/add-card.component";
import {MaterialModule} from "@angular/material";
import {ContextMenuHolderComponent} from './context-menu-holder/context-menu-holder.component';
import {ContextMenuService} from "./context-menu-holder/context-menu.service";
import {WeekComponent} from './week/week.component';
import {FlexLayoutModule} from "@angular/flex-layout";

@NgModule({
  imports: [
    CommonModule,
    DndModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  declarations: [CalendarComponent,
    CalendarDayForMonthComponent,
    CalendarCardComponent,
    OverDueAreaComponent,
    CalendarFooterComponent,
    CalendarToolbarComponent,
    AddCardComponent,
    NoDueAreaComponent,
    ContextMenuHolderComponent,
    WeekComponent,
  ],
  exports: [
    CalendarCardComponent,
    AddCardComponent,
    OverDueAreaComponent,
    NoDueAreaComponent,
    CalendarComponent
  ],
  providers: [
    ContextMenuService
  ],
  entryComponents: [
    AddCardComponent,
  ]
})
export class CalendarModule {
}
