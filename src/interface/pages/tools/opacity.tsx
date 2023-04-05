import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import i18next from 'i18next';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { closeOpacityPresetEdit, openOpacityPresetEdit } from '../../../reducer/tools';
import { TState, store } from '../../../store';
import { ActionType } from '../../../store-action-types';

function applyOpacityPreset(value: number) {
    const { open, index } = store.getState().tools.opacityPreseEdit;
    if (!open || index === -1 || value < 0 || value > 100)
        return;

    store.dispatch(closeOpacityPresetEdit(value));
}

export const CurrentToolOpacity = () => {

    return (
        <div className="section">
            <h3 className="title">{i18next.t('opacity')}</h3>
            <OpacityPresetEditDialog />
            <div className="flex stretch">
                {OpacityPresetButton(0)}
                {OpacityPresetButton(1)}
                {OpacityPresetButton(2)}
                {OpacityPresetButton(3)}
                {OpacityPresetButton(4)}
            </div>
        </div>
    );
};

const OpacityPresetButton = (index: number) => {

    const value = useSelector((state: TState) => state.tools.opacity.presets[index]);
    const opacity = useSelector((state: TState) => state.currentToolOptions.opacity);
    const isActive = Math.abs(value - opacity) < 1e-8;

    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => onPresetClick(e);

    return (
        <sp-action-button data-index={index} data-active={isActive} onClick={onClick}>{value}%</sp-action-button>
    );
};

const OpacityPresetEditDialog = () => {

    const open = useSelector((state: TState) => state.tools.opacityPreseEdit.open);
    const index = useSelector((state: TState) => state.tools.opacityPreseEdit.index);
    let value = useSelector((state: TState) => state.tools.opacityPreseEdit.index);

    const defaultValue = (index !== -1) ? value : 0;
    const titleIndex = index + 1;

    const presetInputValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        value = parseInt(e.currentTarget.value.replace(/,/, '.'));
    };
    const cancelPresetEdit = () => {
        store.dispatch(closeOpacityPresetEdit());
    };
    const applyPresetEdit = () => {
        applyOpacityPreset(value);
        store.dispatch(closeOpacityPresetEdit());
    };

    return (
        <Dialog open={open} BackdropProps={{ open: true }}>
            <DialogTitle>Härte Preset {titleIndex}</DialogTitle>
            <DialogContent>
                <div className="flex" style={{ alignItems: 'center' }}>
                    <sp-textfield placeholder="Value" type="number" defaultValue={defaultValue} onInput={presetInputValueChanged}></sp-textfield>
                </div>
            </DialogContent>
            <DialogActions>
                <sp-action-button onClick={cancelPresetEdit}>{i18next.t('cancel')}</sp-action-button>
                <sp-action-button onClick={applyPresetEdit}>OK</sp-action-button>
            </DialogActions>
        </Dialog>
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
