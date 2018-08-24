// -> Takes previous state + action, returnes new // new state
import {Settings} from '../../models/settings';
import {SettingsActions} from '../actions/settings-actions';

const initialState = new Settings();

export default (state: Settings = initialState, action: any) => {
  switch (action.type) {
    case SettingsActions.SET_WEEKSTART:
      return Object.assign({}, state, {weekStart: action.payload});
    case SettingsActions.RESET_SETTINGS_STORE:
      return initialState;
    case SettingsActions.SET_BOARD_COLOR:
      state.boardColorPrefs[action.payload.boardId] = action.payload.color;
      return {
        ...state
      };
    case SettingsActions.SET_BOARD_VISIBILITY:
      state.boardVisibilityPrefs[action.payload.boardId] = action.payload.visibility;
      return {
        ...state
      };
    case SettingsActions.CHANGE_TYPE:
      return Object.assign({}, state, {type: action.payload});
    case SettingsActions.REMOVE_BOARD_PREFERENCES:
      return Object.assign({}, state, {
        boardColorPrefs: {},
        boardVisibilityPrefs: {}
      });
    case SettingsActions.TOGGLE_INCLUDE_DONE:
      return Object.assign({}, state, {
        includeDoneCards: action.payload as boolean
      });
    case SettingsActions.TOGGLE_SHOW_MEMBERS:
      return Object.assign({}, state, {
        showMembers: action.payload as boolean
      });
    case SettingsActions.SET_FILTER_FOR_USER:
      return Object.assign({}, state, {
        filterForUser: action.payload
      });
    case SettingsActions.TOGGLE_WEEKVIEW_SHOW_HOURS:
      return Object.assign({}, state, {
        weekViewShowHours: action.payload as boolean
      });
    case SettingsActions.SET_SHOW_WEEKEND:
      return Object.assign({}, state, {
        showWeekend: action.payload as number
      });
    case SettingsActions.SET_BUSINESS_HOURS_START:
      return Object.assign({}, state, {
        businessHoursStart: action.payload as number
      });
    case SettingsActions.SET_BUSINESS_HOURS_END:
      return Object.assign({}, state, {
        businessHoursEnd: action.payload as number
      });
    case SettingsActions.SET_FILTER_FOR_LABEL:
      return Object.assign({}, state, {
        filterForLabel: action.payload
      });
    default:
      return state;
  }
};
