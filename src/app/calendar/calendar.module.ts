import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarComponent} from './calendar.component';
import {NoDueAreaComponent} from './no-due-area/no-due-area.component';
import {CalendarDayForMonthComponent} from './calendar-day-month/calendar-day-month.component';
import {CalendarCardComponent} from './calendar-card/calendar-card.component';
import {OverDueAreaComponent} from './over-due-area/over-due-area.component';
import {CardDropZoneComponent} from './card-drop-zone/card-drop-zone.component';
import {CalendarToolbarComponent} from './calendar-toolbar/calendar-toolbar.component';
import {DndModule} from '@beyerleinf/ngx-dnd';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AddCardComponent} from './add-card/add-card.component';
import {ContextMenuHolderComponent} from './context-menu-holder/context-menu-holder.component';
import {ContextMenuService} from './context-menu-holder/context-menu.service';
import {WeekComponent} from './week/week.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MemberSelectorComponent} from './member-selector/member-selector.component';
import {CutStringPipe} from '../shared/cut-string.pipe';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';
import {LabelSelectorComponent} from './label-selector/label-selector.component';
import { MonthComponent } from './month/month.component';

@NgModule({
  imports: [
    CommonModule,
    DndModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMenuModule,
  ],
  declarations: [CalendarComponent,
    CalendarDayForMonthComponent,
    CalendarCardComponent,
    OverDueAreaComponent,
    CardDropZoneComponent,
    CalendarToolbarComponent,
    AddCardComponent,
    NoDueAreaComponent,
    ContextMenuHolderComponent,
    WeekComponent,
    MemberSelectorComponent,
    CutStringPipe,
    LabelSelectorComponent,
    MonthComponent,
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
