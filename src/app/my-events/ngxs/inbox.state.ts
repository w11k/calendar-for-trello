import { AddInbox, ClearInbox } from './app.action';
import { InboxModel } from './inbox.state';
import { Action, State, Selector, StateContext } from '@ngxs/store';

export interface InboxModel {
    inbox: any[];
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
    addInbox({ getState, setState }: StateContext<InboxModel>, { payload }: AddInbox) {
        const state = getState();
        setState({
            inbox: [...state.inbox, payload]
        });
    }

    @Action(ClearInbox)
    clearInbox({ patchState }: StateContext<InboxModel>) {
        patchState({
            inbox: []
        });
    }

}
