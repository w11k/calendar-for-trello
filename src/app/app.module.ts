import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {routing} from "./routes";
import {NgRedux} from "ng2-redux";
import {NgReduxRouter} from "ng2-redux-router";
import {CalendarComponent} from './components/calendar/calendar.component';
import {CardActions} from "./redux/actions/card-actions";
import {BoardActions} from "./redux/actions/board-actions";
import {UserActions} from "./redux/actions/user-actions";
import {CalendarService} from "./services/calendar.service";
import {CalendarDayComponent} from './components/calendar-day/calendar-day.component';
import {CalendarCardComponent} from './components/calendar-card/calendar-card.component';
import {CalendarActions} from "./redux/actions/calendar-actions";
import {TrelloAuthService} from "./services/trello-auth.service";
import {TrelloHttpService} from "./services/trello-http.service";
import {DragulaModule} from "ng2-dragula/ng2-dragula";
import {FrontPageComponent} from "./components/front-page/front-page.component";
import {SetTokenComponent} from "./components/set-token/set-token.component";
import {MemberGuard} from "./services/guards/memberGuard";
import {VisitorGuard} from "./services/guards/visitorGuard";
import {TrelloPullService} from "./services/trello-pull.service";
import {SettingsActions} from "./redux/actions/settings-actions";
import {OverDueAreaComponent} from "./components/over-due-area/over-due-area.component";

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    CalendarDayComponent,
    CalendarCardComponent,
    FrontPageComponent,
    SetTokenComponent,
    OverDueAreaComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    DragulaModule,
  ],
  providers: [
    NgRedux,
    NgReduxRouter,
    CardActions,
    BoardActions,
    UserActions,
    CalendarService,
    CalendarActions,
    TrelloAuthService,
    TrelloHttpService,
    MemberGuard,
    VisitorGuard,
    TrelloPullService,
    SettingsActions
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
