import { percent } from '../common/units';
import { setToolOptions } from '../modules/application/set-tool-options';
import { ActionType } from '../store-action-types';
import { CurrentToolOptionsDescriptor, UpdateToolDataAction } from './shared-action-types';

export interface CurrentToolOptionsStateBase {
    _descriptor: CurrentToolOptionsDescriptor
    hardness: number
    opacity: number
}
export interface CurrentToolOptionsState extends CurrentToolOptionsStateBase {
    promise?: Promise<void>
}
export interface SetToolOpacityAction {
    type: ActionType.SetToolOpacity,
    value: number
}
export interface SetToolHardnessAction {
    type: ActionType.SetToolHardness,
    value: number
}
export interface SetToolOptionsAction {
    type: ActionType.SetToolOptions
    values: Partial<CurrentToolOptionsStateBase>
}

const initial: CurrentToolOptionsState = {
    _descriptor: {} as CurrentToolOptionsDescriptor,
    promise: undefined,
    hardness: -1,
    opacity: 0
};

export type CurrentToolOptionsAction = UpdateToolDataAction | SetToolOpacityAction | SetToolHardnessAction | SetToolOptionsAction;

function updateToolOptions(state: CurrentToolOptionsState): CurrentToolOptionsState {
    state.promise = Promise.resolve(state.promise).then(
        () => {
            const descriptor = state._descriptor;

            if (descriptor.brush) {
                descriptor.brush.hardness = percent(state.hardness);
            }

            descriptor.opacity = state.opacity;
            descriptor.useScatter = false;

            return setToolOptions(descriptor);
        }
    );
    return state;
}

export default function currentToolOptions(state: CurrentToolOptionsState = initial, action: CurrentToolOptionsAction): CurrentToolOptionsState {
    switch (action.type) {
        case ActionType.SetToolOpacity: {
            return updateToolOptions({
                ...state,
                opacity: action.value
            });
        }
        case ActionType.SetToolHardness: {
            return updateToolOptions({
                ...state,
                hardness: action.value
            });
        }
        case ActionType.SetToolOptions:
            return updateToolOptions({
                ...state,
                ...action.values
            });
        case ActionType.UpdatePollData:
            return {
                _descriptor: action.currentToolOptions,
                hardness: action.currentToolOptions.brush?.hardness?._value ?? -1,
                opacity: action.currentToolOptions.opacity
            };
        default:
            return state;
    }
}