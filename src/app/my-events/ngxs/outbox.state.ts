import {AddInbox, AddOutbox, ClearOutbox} from './app.action';
import {OutboxModel} from './outbox.state';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Card} from '../../models/card';

export interface OutboxModel {
  outbox: Card[];
}

@State<OutboxModel>({
  name: 'outbox',
  defaults: {
    outbox: []
  }
})

export class OutboxState {

  @Selector()
  static getOutbox(state: OutboxModel) {
    return state.outbox;
  }

  @Action(AddOutbox)
  addOutbox({getState, patchState}: StateContext<OutboxModel>, {payload}: AddInbox) {
    const state = getState();
    patchState({
      outbox: [...state.outbox, payload]
    });
  }

  @Action(ClearOutbox)
  clearOutbox({patchState}: StateContext<OutboxModel>) {
    patchState({
      outbox: []
    });
  }

}
