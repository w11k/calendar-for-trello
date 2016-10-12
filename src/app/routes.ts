import {RouterModule, Routes} from '@angular/router';
import {CalendarComponent} from "./components/calendar/calendar.component";
import {FrontPageComponent} from "./components/front-page/front-page.component";
import {SetTokenComponent} from "./components/set-token/set-token.component";
import {MemberGuard} from "./services/guards/memberGuard";
import {VisitorGuard} from "./services/guards/visitorGuard";


let routes: Routes = [{
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

  }
];
export const routing = RouterModule.forRoot(routes);
