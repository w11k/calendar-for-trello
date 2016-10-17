// -> Takes previous state + action, returnes new // new state
import {Settings} from "../../models/settings";
import {SettingsActions} from "../actions/settings-actions";

export default (state: Settings = new Settings(), action: any) => {
  switch (action.type) {
    case SettingsActions.TOGGLE_OBSERVER_MODE:
      return Object.assign({}, state, {observerMode: !state.observerMode});
    case SettingsActions.SET_LANG:
      return Object.assign({}, state, {language: action.payload});
    default:
      return state;
  }
}
