// -> Takes previous state + action, returnes new // new state
import {Settings} from "../../models/settings";
import {SettingsActions} from "../actions/settings-actions";

const initialState = new Settings();

export default (state: Settings = initialState, action: any) => {
  switch (action.type) {
    case SettingsActions.TOGGLE_OBSERVER_MODE:
      return Object.assign({}, state, {observerMode: !state.observerMode});
    case SettingsActions.SET_LANG:
      return Object.assign({}, state, {language: action.payload});
    case SettingsActions.RESET_SETTINGS_STORE:
      return initialState;
    default:
      return state;
  }
}
