import {AddInbox, ClearInbox} from './app.action';
import {InboxModel} from './inbox.state';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Card} from '../../models/card';

export interface InboxModel {
  inbox: Card[];
}

@State<InboxModel>({
  name: 'inbox',
  defaults: {
    inbox: []
  }
})

export class InboxState {

  @Selector()
  static getInbox(state: InboxModel) {
    return state.inbox;
  }

  @Action(AddInbox)
  addInbox({getState, setState}: StateContext<InboxModel>, {payload}: AddInbox) {
    const state = getState();
    setState({
      inbox: [...state.inbox, payload]
    });
  }

  @Action(ClearInbox)
  clearInbox({patchState}: StateContext<InboxModel>) {
    patchState({
      inbox: []
    });
  }

}
