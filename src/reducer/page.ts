import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Page } from '../enums';

const { actions, reducer } = createSlice({
    name: 'page',
    initialState: Page.Tools,
    reducers: {
        setPage(state, action: PayloadAction<Page>) {
            return action.payload;
        }
    }
});

export default reducer;
export const {
    setPage
} = actions;