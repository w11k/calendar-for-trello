// -> Takes previous state + action, returnes new // new state
import {LabelActions} from '../actions/label-actions';
import {Label} from '../../models/label';
import {Action} from './action';

export interface LabelMap { [s: string]: Label;
}

const initialState: LabelMap = {};

export default (state: LabelMap = initialState, action: Action<Label>) => {
  switch (action.type) {
    case LabelActions.SET_LABEL:
      let labelObj = {};
      labelObj[action.payload.id] = action.payload;
      return Object.assign(state, labelObj);
    case LabelActions.RESET_LABEL_STORE:
      return initialState;
    default:
      return state;
  }
};
