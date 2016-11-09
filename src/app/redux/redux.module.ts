import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsActions} from "./actions/settings-actions";
import {CalendarActions} from "./actions/calendar-actions";
import {UserActions} from "./actions/user-actions";
import {BoardActions} from "./actions/board-actions";
import {CardActions} from "./actions/card-actions";
import {NgRedux} from "ng2-redux";
import {NgReduxRouter} from "ng2-redux-router";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    NgRedux,
    NgReduxRouter,
    CardActions,
    BoardActions,
    UserActions,
    CalendarActions,
    SettingsActions
  ]
})
export class ReduxModule {
}
