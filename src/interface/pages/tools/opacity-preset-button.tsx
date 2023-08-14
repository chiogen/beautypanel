import * as React from 'react';
import { useSelector } from 'react-redux';
import { setToolOpacity } from '../../../reducer/current-tool-options';
import { openOpacityPresetEdit } from '../../../reducer/tools';
import { TState, store } from '../../../store';
import type { ActionButton } from '@spectrum-web-components/action-button';

type OpacityPresetButtonProps = {
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

async function onPresetClick(e: React.MouseEvent<ActionButton>) {
    const button = e.currentTarget;

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

    store.dispatch(setToolOpacity(value));
}