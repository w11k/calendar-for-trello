import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {routing} from "./routes";
import {CalendarService} from "./services/calendar.service";
import {TrelloAuthService} from "./services/trello-auth.service";
import {TrelloHttpService} from "./services/trello-http.service";
import {FrontPageComponent} from "./components/front-page/front-page.component";
import {SetTokenComponent} from "./components/set-token/set-token.component";
import {MemberGuard} from "./services/guards/memberGuard";
import {VisitorGuard} from "./services/guards/visitorGuard";
import {TrelloPullService} from "./services/trello-pull.service";
import {DndModule} from "ng2-dnd";
import 'moment/locale/fr';
import 'moment/locale/de';
import {SearchComponent} from './components/search/search.component';
import {DateTimeFormatService} from "./services/date-time-format.service";
import {BoardSettingsModule} from "./board-settings/board-settings.module";
import {CalendarModule} from "./calendar/calendar.module";
import {ReduxModule} from "./redux/redux.module";
import {MaterialModule, MdToolbarModule, MdCoreModule, MdButtonModule} from "@angular/material";


@NgModule({
  declarations: [
    AppComponent,
    FrontPageComponent,
    SetTokenComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    DndModule.forRoot(),
    BoardSettingsModule,
    CalendarModule,
    ReduxModule,
    MaterialModule.forRoot(),
    MdCoreModule.forRoot(),
    MdToolbarModule.forRoot(),
    MdButtonModule.forRoot(),
  ],
  providers: [
    CalendarService,
    TrelloAuthService,
    TrelloHttpService,
    MemberGuard,
    VisitorGuard,
    TrelloPullService,
    DateTimeFormatService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
