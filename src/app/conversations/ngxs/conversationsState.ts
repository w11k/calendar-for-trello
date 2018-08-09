import {HideHelp, UpdateLastUpdate} from './app.action';
import {Action, Selector, State, StateContext} from '@ngxs/store';

export interface ConversationsModel {
  lastUpdate: Date | null;
  hideHelp: boolean;
}

@State<ConversationsModel>({
  name: 'Conversations',
  defaults: {
    lastUpdate: null,
    hideHelp: false,

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


}
