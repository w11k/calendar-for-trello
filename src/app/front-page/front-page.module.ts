import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FrontPageComponent} from "./front-page.component";
import {DialogComponent} from './dialog/dialog.component';
import {CalendarModule} from "../calendar/calendar.module";
import {MdToolbarModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    CalendarModule,
    MdToolbarModule
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
