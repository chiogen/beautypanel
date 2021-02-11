import { Page } from "../enums";
import { ActionType } from "../store-action-types";

export interface SetPageAction {
    type: ActionType.SetPage
    page: Page
}

export type PageAction = SetPageAction;

export default function (state: Page = Page.Tools, action: PageAction): Page {
    switch (action.type) {
        case ActionType.SetPage:
            return action.page;
        default:
            return state;
    }
}