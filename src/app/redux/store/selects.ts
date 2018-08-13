import {RootState} from '.';
import * as Reselect from 'reselect';
import {Card} from '../../models/card';
import {Settings} from '../../models/settings';
import {User} from '../../models/user';
import {Board} from '../../models/board';
import {CalendarState} from '../reducers/calendar.reducer';
import {endOfDay, isBefore, isWithinRange} from 'date-fns';

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
  (cards: Card[], settings: Settings) => {
    return cards.filter(
    card => !settings.boardVisibilityPrefs[card.idBoard] && (settings.includeDoneCards ? true : !card.dueComplete) &&
      (settings.filterForUser ? card.idMembers.indexOf(settings.filterForUser) > -1 : true)
    );
  });

export const selectClosedBoards = Reselect.createSelector(
  (state: RootState) => state.boards,
  (boards: Board[]) => boards.filter(board => board.closed)
);

export const selectOpenBoards = Reselect.createSelector(
  (state: RootState) => state.boards,
  (boards: Board[]) => boards.filter(board => !board.closed)
);

//
export const selectVisibleCardsInRange = Reselect.createSelector(
  (state: RootState) => state.calendar,
  (state: RootState) => state.cards,
  (state: RootState) => state.settings,
  (state: RootState) => state.user,
  (calState: CalendarState, cards: Card[], settings: Settings, user: User) => {
    return cards
      .filter(
        card => !settings.boardVisibilityPrefs[card.idBoard] && (settings.includeDoneCards ? true : !card.dueComplete) &&
          (settings.filterForUser ? card.idMembers.indexOf(settings.filterForUser) > -1 : true)
      )
      .filter(it => {
        // pre filter cards: Only show cards that are in the calendar range
        const firstRelevantDate = calState.days[0];
        const lastRelevantDate = calState.days[calState.days.length - 1];

        if (!firstRelevantDate || !lastRelevantDate) {
          return [];
        }

        return isWithinRange(it.due, firstRelevantDate.date, endOfDay(lastRelevantDate.date));
      });
  });


export const selectOverdueCards = Reselect.createSelector(
  selectVisibleCards,
  (cards: Card[]) => {
    const now = new Date();
    return cards.filter(card => card.due && !card.dueComplete && isBefore(card.due, now));
  }
);
