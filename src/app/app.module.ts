import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {routing} from './routes';
import {CalendarDaysService} from './services/calendar-days.service';
import {TrelloAuthService} from './services/trello-auth.service';
import {TrelloHttpService} from './services/trello-http.service';
import {SetTokenComponent} from './components/set-token/set-token.component';
import {MemberGuard} from './services/guards/member.guard';
import {VisitorGuard} from './services/guards/visitor.guard';
import {TrelloPullService} from './services/trello-pull.service';
import {SearchComponent} from './components/search/search.component';
import {DateTimeFormatService} from './services/date-time-format.service';
import {SettingsModule} from './settings/settings.module';
import {CalendarModule} from './calendar/calendar.module';
import {ReduxModule} from './redux/redux.module';
import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatToolbarModule
} from '@angular/material';
import {FrontPageModule} from './front-page/front-page.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AboutModule} from './about/about.module';
import {SidebarComponent} from './sidebar/sidebar.component';
import {LoadingSpinnerComponent} from './loading-spinner/loading-spinner.component';
import {MemberActions} from './redux/actions/member-actions';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {DropZoneService} from './services/drop-zone.service';
import {LegalModule} from './legal/legal.module';
import {NgReduxRouterModule} from '@angular-redux/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ConversationsModule} from './conversations/conversations.module';
import {QueueInterceptor} from './shared/queue.interceptor';
import {TokenInterceptor} from './shared/token.interceptor';
import {DndModule} from '@beyerleinf/ngx-dnd';
import {TrackingModule} from './tracking/tracking.module';


@NgModule({
  declarations: [
    AppComponent,
    SetTokenComponent,
    SearchComponent,
    SidebarComponent,
    LoadingSpinnerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing,
    NgReduxRouterModule.forRoot(),
    DndModule.forRoot(), // https://github.com/akserg/@beyerleinf/ngx-dnd/pull/90
    SettingsModule,
    CalendarModule,
    AboutModule,
    ReduxModule,
    FrontPageModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatSelectModule,
    MatListModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NoopAnimationsModule,
    FlexLayoutModule,
    MatMenuModule,
    MatInputModule,
    MatSnackBarModule,
    MatIconModule,
    LegalModule,
    ConversationsModule,
    BrowserAnimationsModule,
    TrackingModule.forRoot()
  ],
  providers: [
    CalendarDaysService,
    TrelloAuthService,
    TrelloHttpService,
    MemberGuard,
    VisitorGuard,
    TrelloPullService,
    DateTimeFormatService,
    MemberActions,
    DropZoneService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: QueueInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },

    // {provide: ErrorHandler, useClass: RavenErrorHandler}

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
