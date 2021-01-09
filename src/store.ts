import { AnyAction, combineReducers, createStore, Reducer, Store } from "redux";
import { Page } from "./enums";

export enum ActionType {
    SetPage = 'SET_PAGE'
}

export interface TState {
    readonly page: Page
}

function page(state: Page = Page.Tools, action: AnyAction): Page {
    switch (action.type) {
        case ActionType.SetPage:
            return action.page;
        default:
            return state;
    }
}

const reducer: Reducer<TState, AnyAction> = combineReducers({
    page
});

export const store: Store<TState, AnyAction> = createStore(reducer);