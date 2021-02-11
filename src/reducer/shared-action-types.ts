import { ActionType } from "../store-action-types";

export interface UpdatePollDataAction {
    type: ActionType.UpdatePollData
    currentTool: string
    currentToolOptions: {
        opacity: number
        hardnes: number
    }
}