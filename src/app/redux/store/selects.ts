import {RootState} from '.';
import * as Reselect from 'reselect';
import {Card} from '../../models/card';
import {Settings} from '../../models/settings';
import {User} from '../../models/user';
import {Board} from '../../models/board';

export function selectBoardColorPrefs(state: RootState) {
  return state.settings.boardColorPrefs;
}

export function selectBoardVisibilityPrefs(state: RootState) {
  return state.settings.boardVisibilityPrefs;
}

export function selectCalendarDays(state: RootState) {
  return state.calendar.days;
}

export function selectCalendarDate(state: RootState) {
  return state.calendar.date;
}

export function selectSettingsType(state: RootState) {
  return state.settings.type;
}

export function selectSettingsLanguage(state: RootState) {
  return state.settings.language;
}
export function selectSettingsWeekStart(state: RootState) {
  return state.settings.weekStart;
}

export function selectBoards(state: RootState) {
  return state.boards;
}

export function selectSettingsWorkdays(state: RootState) {
  return state.settings.weekDays;
}

/**
 * returns the visible cards per User
 * takes care of:
 * 1) is board of the card visible?
 * 2) should done cards be displayed
 * 3) filter for user
 * */

export const selectVisibleCards = Reselect.createSelector(
  (state: RootState) => state.cards,
  (state: RootState) => state.settings,
  (state: RootState) => state.user,
  (cards: Card[], settings: Settings, user: User) => cards.filter(
    card => !settings.boardVisibilityPrefs[card.idBoard] && (settings.includeDoneCards ? true : !card.dueComplete) &&
      (settings.filterForUser ? card.idMembers.indexOf(settings.filterForUser) > -1 : true) &&
      (settings.filterForLabel ? (settings.filterForLabel.split(',').some(r => card.idLabels.indexOf(r) > -1)) : true)
  )
);

export const selectClosedBoards = Reselect.createSelector(
  (state: RootState) => state.boards,
  (boards: Board[]) => boards.filter(board => board.closed)
);

export const selectOpenBoards = Reselect.createSelector(
  (state: RootState) => state.boards,
  (boards: Board[]) => boards.filter(board => !board.closed)
);

