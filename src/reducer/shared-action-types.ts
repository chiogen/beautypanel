import type { ActionType } from "../store-action-types";
import { CurrentToolOptionsState } from "./current-tool-options";

export interface UpdateToolDataAction {
    type: ActionType.UpdatePollData
    currentToolOptions: CurrentToolOptionsState
}