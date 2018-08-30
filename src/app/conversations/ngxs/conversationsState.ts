import { HideHelp, HideLoadButton, UpdateLastUpdate } from './app.action';
import {Action, Selector, State, StateContext} from '@ngxs/store';

export interface ConversationsModel {
  lastUpdate: Date | null;
  hideHelp: boolean;
  hideLoadButton: boolean;
}

@State<ConversationsModel>({
  name: 'Conversations',
  defaults: {
    lastUpdate: null,
    hideHelp: false,
    hideLoadButton: false,
  }
})

export class ConversationsState {

  @Selector()
  static getLastUpdate(state: ConversationsModel) {
    return state.lastUpdate;
  }

  @Selector()
  static getHideHelp(state: ConversationsModel) {
    return state.hideHelp;
  }

  @Selector()
  static getHideLoadButton(state: ConversationsModel) {
    return state.hideLoadButton;
  }

  @Action(UpdateLastUpdate)
  updateLastUpdate({setState, patchState}: StateContext<ConversationsModel>, {payload}: UpdateLastUpdate) {
    patchState({
      lastUpdate: payload
    });
  }


  @Action(HideHelp)
  updateHideHelp({setState, patchState}: StateContext<ConversationsModel>, {payload}: HideHelp) {
    patchState({
      hideHelp: payload
    });
  }

  @Action(HideLoadButton)
  updateHideLoadButton({setState, patchState}: StateContext<ConversationsModel>, {payload}: HideLoadButton) {
    patchState({
      hideLoadButton: payload
    });
  }


}
