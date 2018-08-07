import { AddInbox, AddOutbox, ClearOutbox } from './app.action';
import { OutboxModel } from './outbox.state';
import { Action, State, Selector, StateContext } from '@ngxs/store';

export interface OutboxModel {
    outbox: any[];
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
    addOutbox({ getState, patchState }: StateContext<OutboxModel>, { payload }: AddInbox) {
        const state = getState();
        patchState({
            outbox: [...state.outbox, payload]
        })
    }

    @Action(ClearOutbox)
    clearOutbox({ patchState }: StateContext<OutboxModel>) {
        patchState({
            outbox: []
        })
    }

}
