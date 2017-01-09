import {RootState} from "./index";

export function selectBoardColorPrefs(state: RootState) {
  return state.settings.boardVisibilityPrefs;
}
export function selectBoardVisibilityPrefs(state: RootState) {
  return state.settings.boardColorPrefs;
}
export function selectCalendarDays(state: RootState) {
  return state.calendar.days
}
export function selectCalendarDate(state: RootState) {
  return state.calendar.date
}
export function selectSettingsType(state: RootState) {
  return state.settings.type
}
export function selectSettingsLanguage(state: RootState) {
  return state.settings.language
}

