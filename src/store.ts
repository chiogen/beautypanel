import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { AnyAction, combineReducers, createStore, Store } from 'redux';
import { setAsyncInterval } from './common/set-async-interval';
import currentTool from './reducer/current-tool';
import currentToolOptions from './reducer/current-tool-options';
import page from './reducer/page';
import save from './reducer/save';
import { CurrentToolOptionsDescriptor, UpdateToolDataAction } from './reducer/shared-action-types';
import sharpenOptions from './reducer/sharpen-options';
import { ActionType } from './store-action-types';


const lastAction = (_s: AnyAction, action: AnyAction) => action;

const reducer = combineReducers({
    lastAction,
    page,
    save,
    currentTool,
    currentToolOptions,
    sharpenOptions
});

export const store: Store<TState> = createStore(reducer);
(window as any).getState = store.getState;

export type TState = ReturnType<typeof reducer>;

// Poll required app state data
async function poll() {
    try {

        // Wait for latest promise for setting tool options
        await store.getState().currentToolOptions.promise;

        const brushDataDescriptor: ActionDescriptor = {
            _obj: 'get',
            _target: [
                {
                    _property: 'tool'
                },
                {
                    _ref: 'application',
                    _enum: 'ordinal',
                    _value: 'targetEnum'
                }
            ],
            _options: {
                dialogOptions: 'dontDisplay'
            }
        };

        const [toolData] = await app.batchPlay([
            brushDataDescriptor
        ], {});
        const currentToolOptions = toolData.currentToolOptions as CurrentToolOptionsDescriptor;

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