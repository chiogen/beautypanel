import { combineReducers } from 'redux';
import { ActionType } from '../store-action-types';

export interface SharpenOptions {
    useDetailLayer: boolean
}

export interface SetSharpenOptionsAction extends Partial<SharpenOptions> {
    type: ActionType.SetSharpenOptions
}
export type SharpenOptionsAction = SetSharpenOptionsAction;

function useDetailLayer(state = true, action: SharpenOptionsAction): boolean {
    switch (action.type) {
        case ActionType.SetSharpenOptions:
            return Boolean(action.useDetailLayer) ?? state;
        default:
            return state;
    }
}


export default combineReducers<SharpenOptions, SharpenOptionsAction>({
    useDetailLayer
});
