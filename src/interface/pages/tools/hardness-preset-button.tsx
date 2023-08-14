import * as React from 'react';
import { useSelector } from 'react-redux';
import { setToolHardness } from '../../../reducer/current-tool-options';
import { openHardnessPresetEdit } from '../../../reducer/tools';
import { TState, store } from '../../../store';
import type { ActionButton } from '@spectrum-web-components/action-button';

type HardnessPresetButtonProps = {
    index: number
};

export const HardnessPresetButton = ({ index }: HardnessPresetButtonProps) => {

    const value = useSelector((state: TState) => state.tools.hardness.presets[index]);
    const activeHardness = useSelector((state: TState) => state.currentToolOptions.hardness);
    const isActive = Math.abs(value - activeHardness) < 1e-8;

    return (
        <sp-action-button data-index={index} data-active={isActive} onClick={onPresetClick}>{value}%</sp-action-button>
    );
};

async function onPresetClick(e: React.MouseEvent<ActionButton>) {
    const button = e.currentTarget;

    if (e.button !== 0)
        return;

    if (e.altKey) {
        const index = parseInt(button.dataset.index!);
        store.dispatch(openHardnessPresetEdit(index));
        return;
    }

    const state = store.getState();
    const index = parseInt(button.dataset.index!);
    const value = state.tools.hardness.presets[index];

    store.dispatch(setToolHardness(value));
}