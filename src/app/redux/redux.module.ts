import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsActions} from './actions/settings-actions';
import {CalendarActions} from './actions/calendar-actions';
import {UserActions} from './actions/user-actions';
import {BoardActions} from './actions/board-actions';
import {CardActions} from './actions/card-actions';
import {NgReduxModule} from '@angular-redux/store';
import {NgReduxRouter} from '@angular-redux/router';
import {ListActions} from './actions/list-actions';
import {LabelActions} from './actions/label-actions';

@NgModule({
  imports: [
    CommonModule,
    NgReduxModule
  ],
  declarations: [],
  providers: [
    NgReduxRouter,
    CardActions,
    BoardActions,
    UserActions,
    CalendarActions,
    SettingsActions,
    ListActions,
    LabelActions,
  ]
})
export class ReduxModule {
}
