import { UpdateLastUpdate } from './app.action';
import { Action, State, Selector, StateContext } from '@ngxs/store';

export interface LastUpdateModel {
   lastUpdate: string;
}
@State<LastUpdateModel>({
    name: 'lastUpdate',
    defaults: {
        lastUpdate: ''
    }
})

export class LastUpdateState {

    @Selector()
    static getLastUpdate(state: LastUpdateModel) {
        return state.lastUpdate;
    }

    @Action(UpdateLastUpdate)
    updateLastUpdate({ setState }: StateContext<LastUpdateModel>, { payload }: UpdateLastUpdate) {
        setState({
            lastUpdate: payload
        })
    }

}
