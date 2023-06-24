import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
    name: 'sharpen',
    initialState: {
        useDetailLayer: true
    },
    reducers: {
        setUseDetailLayer(state, action: PayloadAction<boolean>) {
            state.useDetailLayer = action.payload;
        }
    }
});

export default reducer;
export const {
    setUseDetailLayer
} = actions;