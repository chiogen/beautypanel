import { createSlice } from '@reduxjs/toolkit';
import { parse } from 'path';
import { app } from 'photoshop';

const { actions, reducer } = createSlice({
    name: 'activeDocument',
    initialState: {
        loaded: !!app.activeDocument,
        name: '',
        directory: '',
        extension: '',
        path: '',
        width: 0,
        height: 0,
    },
    reducers: {
        updateActiveDocumentInfo(state) {

            // Reset first
            state.name = '';
            state.directory = '';
            state.extension = '';
            state.path = '';
            state.width = 0;
            state.height = 0;

            const document = app.activeDocument;
            state.loaded = !!document;

            if (!document?.path) {
                return;
            }

            const { dir, ext } = parse(document.path);
            state.width = document.width;
            state.height = document.height;
            state.path = document.path;
            state.name = document.name;
            state.extension = ext;
            state.directory = dir;

        }
    }
});

export default reducer;
export const {
    updateActiveDocumentInfo
} = actions;