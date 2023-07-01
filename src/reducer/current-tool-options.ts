import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CurrentToolOptionsDescriptor, UPDATE_TOOL_DATA, UpdateToolDataAction } from './shared-action-types';
import { setToolOptionsFromState } from '../modules/actions/tool-options';

let _descriptor: CurrentToolOptionsDescriptor;

const { reducer, actions } = createSlice({
    name: 'currentToolOptions',
    initialState: {
        hardness: -1,
        opacity: 0
    },
    reducers: {
        setToolOpacity(state, action: PayloadAction<number>) {
            state.opacity = action.payload;
            setToolOptionsFromState(_descriptor, state.opacity, state.hardness);
        },
        setToolHardness(state, action: PayloadAction<number>) {
            state.hardness = action.payload;
            setToolOptionsFromState(_descriptor, state.opacity, state.hardness);
        }
    },
    extraReducers(builder) {
        builder.addCase(UPDATE_TOOL_DATA, (state, action: UpdateToolDataAction) => {
            _descriptor = action.currentToolOptions;
            state.hardness = action.currentToolOptions.brush?.hardness?._value ?? -1;
            state.opacity = action.currentToolOptions.opacity;
        });
    },
});

export default reducer;
export const {
    setToolHardness,
    setToolOpacity,
} = actions;