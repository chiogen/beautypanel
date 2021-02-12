import { app } from "photoshop";
import { setToolOptions, _setToolOptions } from "../common/app-utils";
import { percent } from "../common/type-utils";
import { ActionType } from "../store-action-types";
import { UpdateToolDataAction } from "./shared-action-types";

export interface CurrentToolOptionsStateBase {
    hardness: number
    roundness: number
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
    promise: undefined,
    hardness: -1,
    roundness: -1,
    opacity: 0
};

export type CurrentToolOptionsAction = UpdateToolDataAction | SetToolOpacityAction | SetToolHardnessAction | SetToolOptionsAction;

function updateToolOptions(state: CurrentToolOptionsState): CurrentToolOptionsState {
    state.promise = Promise.resolve(state.promise).then(
        () => setToolOptions({
            brush: {
                _obj: "computedBrush",
                hardness: percent(state.hardness)
            },
            opacity: percent(state.opacity),
            useScatter: false
        })
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
                hardness: action.currentToolOptions.brush?.hardness?._value ?? -1,
                roundness: action.currentToolOptions.brush?.roundness?._value ?? -1,
                opacity: action.currentToolOptions.opacity
            };
        default:
            return state;
    }
}