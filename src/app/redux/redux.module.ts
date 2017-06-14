import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsActions} from './actions/settings-actions';
import {CalendarActions} from './actions/calendar-actions';
import {UserActions} from './actions/user-actions';
import {BoardActions} from './actions/board-actions';
import {CardActions} from './actions/card-actions';
import {NgReduxModule} from 'ng2-redux';
import {NgReduxRouter} from 'ng2-redux-router';
import {ListActions} from './actions/list-actions';

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
  ]
})
export class ReduxModule {
}
