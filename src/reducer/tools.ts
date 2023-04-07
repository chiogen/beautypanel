import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PresetsManager } from '../common/presets-manager';

const DEFAULT_OPACITY_PRESETS = [2, 6, 32, 50, 100];
const DEFAULT_HARDNESS_PRESETS = [2, 6, 32, 50, 100];
const opacityPresets = new PresetsManager<number>('opacity', DEFAULT_OPACITY_PRESETS);
const hardnessPresets = new PresetsManager<number>('hardness', DEFAULT_HARDNESS_PRESETS);

const { actions, reducer } = createSlice({
    name: 'tools',
    initialState: {
        dodgeAndBurn: {
            color: 'gray'
        },
        opacity: {
            presets: opacityPresets.getAll()
        },
        opacityPreseEdit: {
            open: false,
            index: -1,
            value: -1
        },
        hardness: {
            presets: hardnessPresets.getAll()
        },
        hardnessPresetEdit: {
            open: false,
            index: -1,
            value: -1
        }
    },
    reducers: {
        // Dodge and Burn
        useDodgeAndBurnColor(state, action: PayloadAction<string>) {
            state.dodgeAndBurn.color = action.payload;
        },
        // Opacity Preset Edit
        openOpacityPresetEdit(state, action: PayloadAction<number>) {
            state.opacityPreseEdit.open = true;
            state.opacityPreseEdit.index = action.payload;
        },
        updateOpacityPresetEditValue(state, action: PayloadAction<number>) {
            if (!state.opacityPreseEdit.open)
                return;
            state.opacityPreseEdit.value = action.payload;
        },
        closeOpacityPresetEdit(state, action: PayloadAction<number | undefined>) {
            const { index } = state.opacityPreseEdit;

            if (index !== -1 && typeof action.payload === 'number') {
                state.opacity.presets[index] = action.payload;
                opacityPresets.set(index, action.payload);
            }

            state.opacityPreseEdit.open = false;
            state.opacityPreseEdit.index = -1;
            state.opacityPreseEdit.value = -1;
        },
        // Hardness Preset Edit
        openHardnessPresetEdit(state, action: PayloadAction<number>) {
            state.hardnessPresetEdit.open = true;
            state.hardnessPresetEdit.index = action.payload;
        },
        updateHardnessPresetEditValue(state, action: PayloadAction<number>) {
            if (!state.hardnessPresetEdit.open)
                return;
            state.hardnessPresetEdit.value = action.payload;
        },
        closeHardnessPresetEdit(state, action: PayloadAction<number | undefined>) {
            const { index } = state.hardnessPresetEdit;

            if (index !== -1 && typeof action.payload === 'number') {
                state.hardness.presets[index] = action.payload;
                hardnessPresets.set(index, action.payload);
            }

            state.hardnessPresetEdit.open = false;
            state.hardnessPresetEdit.index = -1;
            state.hardnessPresetEdit.value = -1;
        },
    }
});

export default reducer;
export const {
    useDodgeAndBurnColor,
    openOpacityPresetEdit,
    updateOpacityPresetEditValue,
    closeOpacityPresetEdit,
    openHardnessPresetEdit,
    updateHardnessPresetEditValue,
    closeHardnessPresetEdit,
} = actions;