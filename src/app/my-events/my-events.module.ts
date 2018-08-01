import {MatButtonModule, MatCardModule, MatProgressSpinnerModule} from '@angular/material';
import {MyEventsComponent} from './my-events.component';
import {NgModule} from '@angular/core';
import {CalendarModule} from '../calendar/calendar.module';
import {MyEventsService} from './my-events.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';


@NgModule({
  declarations: [
    MyEventsComponent,

  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    CalendarModule,
    FlexLayoutModule,
  ],
  providers: [
    MyEventsService,
  ],
})
export class MyEventsModule {
}
