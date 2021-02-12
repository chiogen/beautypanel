import { PercentValue, PixelValue } from "photoshop";
import type { ActionType } from "../store-action-types";

export interface UpdateToolDataAction {
    type: ActionType.UpdatePollData
    currentToolOptions: {
        brush?: {
            hardness: PercentValue
            roundness: PercentValue
        },
        opacity: number
        useScatter: boolean
    }
}