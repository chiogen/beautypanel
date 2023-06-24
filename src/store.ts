import { configureStore } from '@reduxjs/toolkit';
import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { AnyAction } from 'redux';
import { addActiveDocumentChangedListener } from './common/active-document-observer';
import { setAsyncInterval } from './common/set-async-interval';
import activeDocument, { updateActiveDocumentInfo } from './reducer/active-document';
import copyright from './reducer/copyright';
import currentTool from './reducer/current-tool';
import currentToolOptions from './reducer/current-tool-options';
import page from './reducer/page';
import save from './reducer/save';
import { CurrentToolOptionsDescriptor, updateToolData } from './reducer/shared-action-types';
import sharpenOptions from './reducer/sharpen-options';
import tools from './reducer/tools';


const lastAction = (_s: AnyAction, action: AnyAction) => action;

export const store = configureStore({
    reducer: {
        activeDocument,
        lastAction,
        page,
        tools,
        save,
        copyright,
        currentTool,
        currentToolOptions,
        sharpenOptions
    }
});

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
            store.dispatch(updateToolData(currentToolOptions));
        }

    } catch (err) {
        console.error(err.message || err);
    }

}

setAsyncInterval(poll, 500);