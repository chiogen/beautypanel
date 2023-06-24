import { PayloadAction, createSlice } from '@reduxjs/toolkit';


const initialState = () => {
    const preferredSaveFormat = localStorage.getItem('save.preferredSaveFormat');

    return {
        preferredSaveFormat: preferredSaveFormat || 'jpg'
    };
};

const { reducer, actions } = createSlice({
    name: 'save',
    initialState,
    reducers: {
        setPreferredSaveFormat(state, action: PayloadAction<string>) {
            localStorage.setItem('save.preferredSaveFormat', action.payload);
            state.preferredSaveFormat = action.payload;
        }
    }
});

export default reducer;
export const {
    setPreferredSaveFormat
} = actions;