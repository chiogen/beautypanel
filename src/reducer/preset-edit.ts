import { ActionType } from "../store-action-types";

export type PresetEditState = null | {
    type: 'hardness' | 'opacity',
    index: number
};

export interface StartPresetEdit {
    type: ActionType.StartPresetEdit
    edit: PresetEditState
}
export interface StopPresetEdit {
    type: ActionType.EndPresetEdit
}

export type PresetEditAction = StartPresetEdit | StopPresetEdit;

export default function (state: PresetEditState = null, action: PresetEditAction): PresetEditState {
    switch (action.type) {
        case ActionType.StartPresetEdit:
            return action.edit;
        case ActionType.EndPresetEdit:
            return null;
        default:
            return state;
    }
}