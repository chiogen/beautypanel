import { ActionDescriptor, app } from "photoshop";
import { combineReducers, createStore, Reducer, Store } from "redux";
import { setAsyncInterval } from "./common/set-async-interval";
import { Page } from "./enums";
import page, { PageAction } from './reducer/page'
import currentTool, { CurrentToolAction } from './reducer/current-tool'
import currentToolOptions, { CurrentToolOptionsAction, CurrentToolOptionsState } from './reducer/current-tool-options'
import presetEdit, { PresetEditState, PresetEditAction } from './reducer/preset-edit'
import { UpdateToolDataAction, DocumentChangedAction } from "./reducer/shared-action-types";
import { ActionType } from "./store-action-types";

export interface TState {
    readonly lastAction: TAction
    readonly page: Page
    readonly currentTool: string
    readonly currentToolOptions: CurrentToolOptionsState
    readonly presetEdit: PresetEditState
}

type TSharedAction = UpdateToolDataAction | DocumentChangedAction;
export type TAction = TSharedAction | PageAction | CurrentToolAction | CurrentToolOptionsAction | PresetEditAction;

const lastAction = (_s: TAction, action: TAction) => action;

const reducer: Reducer<TState, TAction> = combineReducers({
    lastAction,
    page,
    currentTool,
    currentToolOptions,
    presetEdit
});

export const store: Store<TState, TAction> = createStore(reducer);


// Poll required app state data
async function poll() {
    try {

        // Wait for latest promise for setting tool options
        await store.getState().currentToolOptions.promise;

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
        const { currentToolOptions } = toolData as any;

        if (currentToolOptions) {
            const action: UpdateToolDataAction = {
                type: ActionType.UpdatePollData,
                currentToolOptions
            };
            store.dispatch(action);
        }

    } catch (err) {
        console.error(err.message || err);
    }

}

setAsyncInterval(poll, 500);