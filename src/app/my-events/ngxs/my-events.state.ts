import {HideHelp, UpdateLastUpdate} from './app.action';
import {Action, Selector, State, StateContext} from '@ngxs/store';

export interface MyEventsModel {
  lastUpdate: Date | null;
  hideHelp: boolean;
}

@State<MyEventsModel>({
  name: 'myEvents',
  defaults: {
    lastUpdate: null,
    hideHelp: false,

  }
})

export class MyEventsState {

  @Selector()
  static getLastUpdate(state: MyEventsModel) {
    return state.lastUpdate;
  }

  @Selector()
  static getHideHelp(state: MyEventsModel) {
    return state.hideHelp;
  }

  @Action(UpdateLastUpdate)
  updateLastUpdate({setState, patchState}: StateContext<MyEventsModel>, {payload}: UpdateLastUpdate) {
    patchState({
      lastUpdate: payload
    });
  }


  @Action(HideHelp)
  updateHideHelp({setState, patchState}: StateContext<MyEventsModel>, {payload}: HideHelp) {
    patchState({
      hideHelp: payload
    });
  }


}
