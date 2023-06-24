import { Draft, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { core } from 'photoshop';
import { percent } from '../common/units';
import { setToolOptions } from '../modules/application/set-tool-options';
import { CurrentToolOptionsDescriptor, UPDATE_TOOL_DATA, UpdateToolDataAction } from './shared-action-types';

type CurrentToolOptionsState = {
    _descriptor: CurrentToolOptionsDescriptor
    hardness: number
    opacity: number
    promise?: Promise<void>
};

const { reducer, actions } = createSlice({
    name: 'currentToolOptions',
    initialState: {
        _descriptor: {} as CurrentToolOptionsDescriptor,
        promise: undefined,
        hardness: -1,
        opacity: 0
    } as CurrentToolOptionsState,
    reducers: {
        setToolOpacity(state, action: PayloadAction<number>) {
            state.opacity = action.payload;
            state.promise = applyUpdatedToolOptions(state);
        },
        setToolHardness(state, action: PayloadAction<number>) {
            state.hardness = action.payload;
            state.promise = applyUpdatedToolOptions(state);
        }
    },
    extraReducers(builder) {
        builder.addCase(UPDATE_TOOL_DATA, (state, action: UpdateToolDataAction) => {
            state._descriptor = action.currentToolOptions;
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

function applyUpdatedToolOptions(state: Draft<CurrentToolOptionsState>) {
    return Promise.resolve(state.promise).then(() => core.executeAsModal(() => {

        const descriptor = state._descriptor;

        if (descriptor.brush) {
            descriptor.brush.hardness = percent(state.hardness);
        }

        descriptor.opacity = state.opacity;
        descriptor.useScatter = false;

        return setToolOptions(descriptor);

    }, {
        commandName: 'Update Tool Options'
    }));
}