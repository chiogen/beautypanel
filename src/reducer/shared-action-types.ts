import { Document } from "photoshop";
import { PercentValue } from "photoshop";
import type { ActionType } from "../store-action-types";

export interface DocumentChangedAction {
    type: ActionType.DocumentChanged
    document: Document | null
}
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