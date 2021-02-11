import { PercentValue, PixelValue } from "photoshop";
import { percent } from "../common/type-utils";
import { ActionType } from "../store-action-types";
import { UpdateToolDataAction } from "./shared-action-types";

/**
 * Type is reduced to the main focus properties of this project. The actual object is way larger.
 */
export interface CurrentToolOptionsState {
    brush: {
        hardness: PercentValue
        roundness: PercentValue
    }
    opacity: number
    useScatter: boolean
}

const initial: CurrentToolOptionsState = {
    brush: {
        hardness: percent(0),
        roundness: percent(0)
    },
    opacity: 0,
    useScatter: false
};

export type CurrentToolOptionsAction = UpdateToolDataAction;

export default function currentToolOptions(state: CurrentToolOptionsState = initial, action: CurrentToolOptionsAction): CurrentToolOptionsState {
    switch (action.type) {
        case ActionType.UpdatePollData:
            return action.currentToolOptions;
        default:
            return state;
    }
}