import { app } from "photoshop";
import { ActionType } from "../store-action-types";
import { UpdateToolDataAction } from "./shared-action-types";

export type CurrentToolAction = UpdateToolDataAction;

export default function currentTool(state: string = app.currentTool.id, action: CurrentToolAction): string {
    switch (action.type) {
        case ActionType.UpdatePollData:
            return app.currentTool.id;
        default:
            return state;
    }
}