import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FrontPageComponent} from "./front-page.component";
import {DialogComponent} from './dialog/dialog.component';
import {CalendarModule} from "../calendar/calendar.module";
import {MdToolbarModule} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";

@NgModule({
  imports: [
    CommonModule,
    CalendarModule,
    MdToolbarModule,
    FlexLayoutModule
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
