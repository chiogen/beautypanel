import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PresetsManager } from '../common/presets-manager';

const DEFAULT_OPACITY_PRESETS = [2, 6, 32, 50, 100];
const opacityPresets = new PresetsManager<number>('opacity', DEFAULT_OPACITY_PRESETS);

const { actions, reducer } = createSlice({
    name: 'tools',
    initialState: {
        opacity: {
            presets: opacityPresets.getAll()
        },
        opacityPreseEdit: {
            open: false,
            index: -1,
        }
    },
    reducers: {
        openOpacityPresetEdit(state, action: PayloadAction<number>) {
            state.opacityPreseEdit.open = true;
            state.opacityPreseEdit.index = action.payload;
        },
        closeOpacityPresetEdit(state, action: PayloadAction<number | undefined>) {
            const { index } = state.opacityPreseEdit;

            if (state.opacityPreseEdit.index !== -1 && typeof action.payload === 'number') {
                state.opacity.presets[index] = action.payload;
                opacityPresets.set(index, action.payload);
            }

            state.opacityPreseEdit.open = false;
            state.opacityPreseEdit.index = -1;
        }
    }
});

export default reducer;
export const {
    openOpacityPresetEdit,
    closeOpacityPresetEdit,
} = actions;