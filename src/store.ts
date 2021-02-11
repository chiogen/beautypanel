import { ActionDescriptor, app } from "photoshop";
import { combineReducers, createStore, Reducer, Store } from "redux";
import { setAsyncInterval } from "./common/set-async-interval";
import { Page } from "./enums";
import page, { PageAction } from './reducer/page'
import currentTool, { CurrentToolAction } from './reducer/current-tool'
import currentToolOptions, { CurrentToolOptionsAction } from './reducer/current-tool-options'
import { UpdateToolDataAction } from "./reducer/shared-action-types";
import { ActionType } from "./store-action-types";

export interface TState {
    readonly page: Page
    readonly currentTool: string
}

export type TAction = PageAction | UpdateToolDataAction | CurrentToolAction | CurrentToolOptionsAction;


const reducer: Reducer<TState, TAction> = combineReducers({
    page,
    currentTool,
    currentToolOptions
});

export const store: Store<TState, TAction> = createStore(reducer);


// Poll required app state data
setAsyncInterval(async () => {
    try {

        // ToDo: Update current tool options (hardness, opacity) (will require executing batchplay);

        const brushDataDescriptor: ActionDescriptor = {
            _obj: 'get',
            _target: [
                {
                    _property: "tool"
                },
                {
                    _ref: "application",
                    _enum: "ordinal",
                    _value: "targetEnum"
                }
            ],
            _options: {
                dialogOptions: "dontDisplay"
            }
        };

        const [toolData] = await app.batchPlay([
            brushDataDescriptor
        ]);
        const { currentToolOptions, message } = toolData as any;

        if (message) {
            app.showAlert(message);
        }
        if (currentToolOptions) {
            const action: UpdateToolDataAction = {
                type: ActionType.UpdatePollData,
                currentToolOptions
            };
            store.dispatch(action);
        }

    } catch (err) {
        app.showAlert(err.message || err);
    }
}, 500);