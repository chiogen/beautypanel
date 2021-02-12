import { ActionType } from "../store-action-types";
import { UpdateToolDataAction } from "./shared-action-types";

export interface CurrentToolOptionsState {
    hardness: number
    roundness: number
    opacity: number
    useScatter: boolean
}

const initial: CurrentToolOptionsState = {
    hardness: -1,
    roundness: -1,
    opacity: 0,
    useScatter: false
};

export type CurrentToolOptionsAction = UpdateToolDataAction;

export default function currentToolOptions(state: CurrentToolOptionsState = initial, action: CurrentToolOptionsAction): CurrentToolOptionsState {
    switch (action.type) {
        case ActionType.UpdatePollData:
            return {
                hardness: action.currentToolOptions.brush?.hardness?._value ?? -1,
                roundness: action.currentToolOptions.brush?.roundness?._value ?? -1,
                opacity: action.currentToolOptions.opacity,
                useScatter: action.currentToolOptions.useScatter
            };
        default:
            return state;
    }
}