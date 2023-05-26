import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StorageKey } from '../enums/storage-key';

export const { actions, reducer } = createSlice({
    name: 'copyright',
    initialState: {
        text: localStorage.getItem(StorageKey.CopyrightText) || ''
    },
    reducers: {
        setCopyrightText(state, action: PayloadAction<string>) {
            state.text = action.payload;
        }
    }
});

export default reducer;
export const {
    setCopyrightText
} = actions;