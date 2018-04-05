import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FrontPageComponent} from './front-page.component';
import {DialogComponent} from './dialog/dialog.component';
import {CalendarModule} from '../calendar/calendar.module';
import {MdButtonModule, MdIconModule, MdToolbarModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AboutModule} from '../about/about.module';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    CalendarModule,
    MdToolbarModule,
    FlexLayoutModule,
    AboutModule,
    RouterModule,
    MdIconModule,
    MdButtonModule,
  ],
  declarations: [
    FrontPageComponent,
    DialogComponent
  ],
  bootstrap: [
    DialogComponent,
  ]
})
export class FrontPageModule {
}
