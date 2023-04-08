import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { AnyAction, combineReducers, createStore } from 'redux';
import { setAsyncInterval } from './common/set-async-interval';
import currentTool from './reducer/current-tool';
import currentToolOptions from './reducer/current-tool-options';
import page from './reducer/page';
import save from './reducer/save';
import tools from './reducer/tools';
import { CurrentToolOptionsDescriptor, UpdateToolDataAction } from './reducer/shared-action-types';
import sharpenOptions from './reducer/sharpen-options';
import { ActionType } from './store-action-types';
import activeDocument, { updateActiveDocumentInfo } from './reducer/active-document';
import { addActiveDocumentChangedListener } from './common/active-document-observer';


const lastAction = (_s: AnyAction, action: AnyAction) => action;

export const store = createStore(combineReducers({
    activeDocument,
    lastAction,
    page,
    tools,
    save,
    currentTool,
    currentToolOptions,
    sharpenOptions
}));

Object.defineProperty(window, 'getState', {
    value: store.getState
});

export type TState = ReturnType<typeof store['getState']>;



addActiveDocumentChangedListener(() => {
    store.dispatch(updateActiveDocumentInfo());
});

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