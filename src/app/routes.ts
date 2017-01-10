import {RouterModule, Routes} from '@angular/router';
import {FrontPageComponent} from "./front-page/front-page.component";
import {SetTokenComponent} from "./components/set-token/set-token.component";
import {MemberGuard} from "./services/guards/memberGuard";
import {VisitorGuard} from "./services/guards/visitorGuard";
import {BoardSettingsComponent} from "./board-settings/board-settings.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {AboutPageComponent} from "./about/about-page/about-page.component";


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
  },
  {
    path: 'about',
    component: AboutPageComponent,
  }
];
export const routing = RouterModule.forRoot(routes);
