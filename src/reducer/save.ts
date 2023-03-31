import { Action } from 'redux';
import { ActionType } from '../store-action-types';

export interface SavePageState {
    preferredSaveFormat: string
}

const initialState = (): SavePageState => {
    const preferredSaveFormat = localStorage.getItem('save.preferredSaveFormat');

    return {
        preferredSaveFormat: preferredSaveFormat || 'jpg'
    };
};

type SetLastCopyExtensionAction = Action<ActionType.SetLastCopyExtension> & {
    ext: string
};

type SavePageAction = SetLastCopyExtensionAction;

export default (state = initialState(), action: SavePageAction): SavePageState => {
    switch (action.type) {
        case ActionType.SetLastCopyExtension:
            if (action.ext)
                localStorage.setItem('save.preferredSaveFormat', action.ext);
            return {
                ...state,
                preferredSaveFormat: action.ext
            };
        default:
            return state;
    }
};

export const setPreferredSaveFormat = (ext: string): SetLastCopyExtensionAction => ({
    type: ActionType.SetLastCopyExtension,
    ext
});