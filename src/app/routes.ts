import {RouterModule, Routes} from '@angular/router';
import {CalendarComponent} from "./components/calendar/calendar.component";
import {FrontPageComponent} from "./components/front-page/front-page.component";
import {SetTokenComponent} from "./components/set-token/set-token.component";
import {MemberGuard} from "./services/guards/memberGuard";
import {VisitorGuard} from "./services/guards/visitorGuard";
import {BoardSettingsComponent} from "./components/board-settings/board-settings.component";


let routes: Routes = [
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
    path: 'boards',
    component: BoardSettingsComponent,
    canActivate: [MemberGuard],
  }
];
export const routing = RouterModule.forRoot(routes);
