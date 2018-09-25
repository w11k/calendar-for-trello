import {Card} from '../../models/card';
import {User} from '../../models/user';
import {Board} from '../../models/board';
import {CalendarState} from '../reducers/calendar.reducer';
import {Settings} from '../../models/settings';
import {Member} from '../../models/member';
import {MemberMap} from '../reducers/member.reducer';

// switch with https://www.npmjs.com/package/redux-replicate-localforage? Since localstorage is sync.
const persistState = require('redux-localstorage');

export const enhancers = [
  persistState('cards', {key: 'w11k.trello-cal/cards'}),
  persistState('boards', {key: 'w11k.trello-cal/boards'}),
  persistState('user', {key: 'w11k.trello-cal/user'}),
  persistState('settings', {key: 'w11k.trello-cal/settings'}),
  persistState('lists', {key: 'w11k.trello-cal/lists'}),
  persistState('members', {key: 'w11k.trello-cal/members'}),
];

if (window.devToolsExtension) {
  enhancers.push(window.devToolsExtension());
}
/*export type State = {
  readonly cards: Card[];
  readonly boards: Board[];
  readonly user: User;
  readonly calendar: CalendarState;
  readonly settings: Settings;
  readonly lists: Object;
  readonly members: Object;
}*/

export interface RootState {
  router: any;
  cards: Card[];
  boards: Board[];
  user: User;
  calendar: CalendarState;
  settings: Settings;
  lists: Object;
  members: MemberMap;
}
