import {ConversationsComponent} from './conversations/conversations.component';
import {RouterModule, Routes} from '@angular/router';
import {FrontPageComponent} from './front-page/front-page.component';
import {SetTokenComponent} from './components/set-token/set-token.component';
import {MemberGuard} from './services/guards/member.guard';
import {VisitorGuard} from './services/guards/visitor.guard';
import {SettingsComponent} from './settings/settings.component';
import {CalendarComponent} from './calendar/calendar.component';
import {AboutPageComponent} from './about/about-page/about-page.component';
import {ImprintComponent} from './legal/imprint/imprint.component';
import {PrivacyComponent} from './legal/privacy/privacy.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [MemberGuard],
    component: CalendarComponent
  }, {
    path: 'start/setToken',
    component: SetTokenComponent
  },
  {
    path: 'start',
    component: FrontPageComponent,
    canActivate: [VisitorGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [MemberGuard],
  },
  {
    path: 'about',
    component: AboutPageComponent,
  },
  {
    path: 'imprint',
    component: ImprintComponent,
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
  },
  {
    path: 'conversations',
    component: ConversationsComponent,
    canActivate: [MemberGuard],
  },
  {
    path: '**', redirectTo: '/',
  }

];
export const routing = RouterModule.forRoot(routes);
