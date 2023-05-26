import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const { actions, reducer } = createSlice({
    name: 'copyright',
    initialState: {
        text: ''
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