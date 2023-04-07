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
    },
    reducers: {
        activeDocumentChanged(state) {

            // Reset first
            state.name = '';
            state.directory = '';
            state.extension = '';
            state.path = '';

            const document = app.activeDocument;
            state.loaded = !!document;

            if (!document?.path) {
                return;
            }

            const { dir, name, ext } = parse(document.path);
            state.path = document.path;
            state.name = document.name;
            state.extension = ext;
            state.directory = dir;

        }
    }
});

export default reducer;
export const {
    activeDocumentChanged
} = actions;