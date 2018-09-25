import {RootState} from '.';
import * as Reselect from 'reselect';
import {Card} from '../../models/card';
import {Settings} from '../../models/settings';
import {Board} from '../../models/board';
import {CalendarState} from '../reducers/calendar.reducer';
import {endOfDay, isBefore, isWithinRange} from 'date-fns';
import {GlobalLabel} from '../../models/label';
import {MemberMap} from '../reducers/member.reducer';
import {Member} from '../../models/member';

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

export function selectBoards(state: RootState) {
  return state.boards;
}

export function selectSettingsWeekStart(state: RootState) {
  return state.settings.weekStart;
}

export function selectSettingsShowWeekend(state: RootState) {
  return state.settings.showWeekend;
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
export const selectVisibleMembers = Reselect.createSelector(
  (state: RootState) => state.members,
  (state: RootState) => state.settings,
  (members: MemberMap, settings: Settings) => {

    const visibleMembers = Object.keys(members).map(key => members[key]).filter(member => {
      const boards = member.boards;

      if (!boards) {
        return false;
      }

      const hasVisibleBoard = boards
        .filter(board => !board.closed)
        .filter(board => !settings.boardVisibilityPrefs[board.id]).length > 0;
      return hasVisibleBoard;
    });
    return visibleMembers;
  });

export const selectClosedBoards = Reselect.createSelector(
  (state: RootState) => state.boards,
  (boards: Board[]) => boards.filter(board => board.closed)
);

export const selectOpenBoards = Reselect.createSelector(
  (state: RootState) => state.boards,
  (boards: Board[]) => boards.filter(board => !board.closed)
);


// does not apply the label filter
export const selectVisibleCardsInRange = Reselect.createSelector(
  (state: RootState) => state.calendar,
  (state: RootState) => state.cards,
  (state: RootState) => state.settings,
  (calState: CalendarState, cards: Card[], settings: Settings) => {
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


export const selectCalendarCards = Reselect.createSelector(
  selectVisibleCardsInRange,
  (state: RootState) => state.settings,
  (cards: Card[], settings: Settings) => {

    const filterForLabel = settings.filterForLabel;
    if (filterForLabel) {
      return cards
        .filter(
          card => card.labels && card.labels.length > 0)
        .filter(card => card.labels.find(lbl => lbl.name === filterForLabel) !== undefined);
    } else {
      return cards;
    }
  });

export const selectVisibleLabelsInRange = Reselect.createSelector(
  selectVisibleCardsInRange,
  (cards: Card[]) => {
    const labelMap = cards
    // select with label only:
      .filter(
        card => card.labels && card.labels.length > 0)
      // reduce to map to filter duplicates
      .reduce((previousValue, currentValue) => {
        currentValue.labels.forEach(minimal => {
          if (previousValue.has(minimal.name)) {
            const global = previousValue.get(minimal.name);
            global.ids.push(minimal.id);
            global.colors.push(minimal.color);
            global.idBoards.push(minimal.idBoard);
          } else {
            previousValue.set(minimal.name, {
              name: minimal.name,
              idBoards: [minimal.idBoard],
              colors: [minimal.color],
              ids: [minimal.id],
            });
          }
        });
        return previousValue;
      }, new Map<string, GlobalLabel>());
    return Array
      .from((labelMap.values()))
      .sort((a, b) => a.name.localeCompare(b.name));
  });


export const selectOverdueCards = Reselect.createSelector(
  selectVisibleCards,
  (state: RootState) => state.settings,
  (cards: Card[], settings: Settings) => {
    const now = new Date();
    const filterForLabel = settings.filterForLabel;
    return cards
      .filter(card => filterForLabel ? card.labels.find(lbl => lbl.name === filterForLabel) !== undefined : true)
      .filter(card => card.due && !card.dueComplete && isBefore(card.due, now));
  }
);


export const selectNoDueCards = Reselect.createSelector(
  selectVisibleCards,
  (state: RootState) => state.settings,
  (cards: Card[], settings: Settings) => {
    const filterForLabel = settings.filterForLabel;
    return cards
      .filter(card => filterForLabel ? card.labels.find(lbl => lbl.name === filterForLabel) !== undefined : true)
      .filter(card => card.due === null);
  }
);
