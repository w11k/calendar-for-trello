// -> Takes previous state + action, returnes new // new state
import {Settings} from "../../models/settings";
import {SettingsActions, CalendarType} from "../actions/settings-actions";

const initialState = new Settings();

export default (state: Settings = initialState, action: any) => {
  switch (action.type) {
    case SettingsActions.TOGGLE_OBSERVER_MODE:
      return Object.assign({}, state, {observerMode: !state.observerMode});
    case SettingsActions.SET_LANG:
      return Object.assign({}, state, {language: action.payload});
    case SettingsActions.RESET_SETTINGS_STORE:
      return initialState;
    case SettingsActions.SET_BOARD_COLOR:
      var newState = Object.assign({}, state);
      newState.boardColorPrefs[action.payload.boardId] = action.payload.color;
      return newState;
    case SettingsActions.SET_BOARD_VISIBILITY:
      var newState = Object.assign({}, state);
      newState.boardVisibilityPrefs[action.payload.boardId] = action.payload.visibility;
      return newState;
    case SettingsActions.CHANGE_TYPE:
      return Object.assign({}, state, {type: state.type === CalendarType.Month ? CalendarType.Week : CalendarType.Month});
    case SettingsActions.REMOVE_BOARD_PREFERENCES:
      return Object.assign({}, state, {
        boardColorPrefs: {},
        boardVisibilityPrefs: {}
      });
    case SettingsActions.TOGGLE_INCLUDE_DONE:
      return Object.assign({}, state, {
        includeDoneCards: action.payload
      });
    default:
      return state;
  }
}
