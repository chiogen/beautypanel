import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import i18next from 'i18next';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { closeOpacityPresetEdit, updateOpacityPresetEditValue } from '../../../reducer/tools';
import { TState, store } from '../../../store';


export const OpacityPresetEditDialog = () => {

    const { open, index } = useSelector((state: TState) => state.tools.opacityPreseEdit);

    const defaultValue = useSelector((state: TState) => state.tools.opacity.presets[index]);
    const titleIndex = index + 1;

    return (
        <Dialog open={open} BackdropProps={{ open: true }}>
            <DialogTitle>Opacity Preset {titleIndex}</DialogTitle>
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

function presetInputValueChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.currentTarget.value.replace(/,/, '.'));
    store.dispatch(updateOpacityPresetEditValue(value));
}
function cancelPresetEdit() {
    store.dispatch(closeOpacityPresetEdit());
}
function applyPresetEdit() {
    const { open, index, value } = store.getState().tools.opacityPreseEdit;
    if (!open || index === -1 || value < 0 || value > 100)
        return;

    store.dispatch(closeOpacityPresetEdit(value));
}
