import * as React from 'react';
import { useSelector } from 'react-redux';
import { openOpacityPresetEdit } from '../../../reducer/tools';
import { TState, store } from '../../../store';
import { ActionType } from '../../../store-action-types';

export type OpacityPresetButtonProps = {
    index: number
};

export const OpacityPresetButton = ({ index }: OpacityPresetButtonProps) => {

    const value = useSelector((state: TState) => state.tools.opacity.presets[index]);
    const opacity = useSelector((state: TState) => state.currentToolOptions.opacity);
    const isActive = Math.abs(value - opacity) < 1e-8;

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
        store.dispatch(openOpacityPresetEdit(index));
        return;
    }

    const state = store.getState();
    const index = parseInt(button.dataset.index!);
    const value = state.tools.opacity.presets[index];

    store.dispatch({
        type: ActionType.SetToolOpacity,
        value
    });
}