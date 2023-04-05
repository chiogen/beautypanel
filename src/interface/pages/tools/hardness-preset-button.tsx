import * as React from 'react';
import { useSelector } from 'react-redux';
import { openHardnessPresetEdit } from '../../../reducer/tools';
import { TState, store } from '../../../store';
import { ActionType } from '../../../store-action-types';

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

async function onPresetClick(e: React.MouseEvent<HTMLButtonElement>) {
    const button = e.currentTarget as HTMLButtonElement;

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

    store.dispatch({
        type: ActionType.SetToolHardness,
        value
    });
}