import { ActionDescriptor, app } from "photoshop";
import { combineReducers, createStore, Reducer, Store } from "redux";
import { setAsyncInterval } from "./common/set-async-interval";
import { Page } from "./enums";
import page, { PageAction } from './reducer/page'
import { UpdatePollDataAction } from "./reducer/shared-action-types";
import { ActionType } from "./store-action-types";

export interface TState {
    readonly page: Page
}

export type TAction = PageAction | UpdatePollDataAction;


const reducer: Reducer<TState, TAction> = combineReducers({
    page
});

export const store: Store<TState, TAction> = createStore(reducer);


// Poll required app state data
setAsyncInterval(async () => {
    try {

        const action: UpdatePollDataAction = {
            type: ActionType.UpdatePollData,
            currentTool: app.currentTool.id,
            currentToolOptions: {
                hardnes: -1,
                opacity: -1
            }
        };

        // ToDo: Update current tool options (hardness, opacity) (will require executing batchplay);

        const brushDataDescriptor: ActionDescriptor = {
            _obj: 'get',
        };

        const [brushData] = await app.batchPlay([
            brushDataDescriptor
        ]);


        store.dispatch(action);

    } catch(err) {
        app.showAlert(err.message || err);
    }
}, 500);