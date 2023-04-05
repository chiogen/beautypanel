import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import i18next from 'i18next';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { closeHardnessPresetEdit, updateHardnessPresetEditValue } from '../../../reducer/tools';
import { TState, store } from '../../../store';


export const HardnessPresetEditDialog = () => {

    const { open, index } = useSelector((state: TState) => state.tools.hardnessPresetEdit);

    const defaultValue = useSelector((state: TState) => state.tools.hardness.presets[index]);
    const titleIndex = index + 1;

    return (
        <Dialog open={open} BackdropProps={{ open: true }}>
            <DialogTitle>Hardness Preset {titleIndex}</DialogTitle>
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
    store.dispatch(updateHardnessPresetEditValue(value));
}
function cancelPresetEdit() {
    store.dispatch(closeHardnessPresetEdit());
}
function applyPresetEdit() {
    const { open, index, value } = store.getState().tools.hardnessPresetEdit;
    if (!open || index === -1 || value < 0 || value > 100)
        return;

    store.dispatch(closeHardnessPresetEdit(value));
}
