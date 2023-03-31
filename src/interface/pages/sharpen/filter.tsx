import i18next from 'i18next';
import { app, core } from 'photoshop';
import * as React from 'react';
import { BeautyPanel } from '../../../common/beautypanel';
import { handleException } from '../../../common/errors/handle-error';
import { DialogOptions } from '../../../enums/dialog-options';
import { executeFreqSeparationFilter } from '../../../modules/actions/frequency-separation-filter';
import { executeMaskedFilter } from '../../../modules/actions/masked-filter';
import { executeSelectiveFilter } from '../../../modules/actions/selective-filter';
import { filterUnsharpMask } from '../../../modules/filter/sharpen/unsharp-mask';
import { selectLayers } from '../../../modules/image/select-layers';
import { store } from '../../../store';

export const Filter = () => (
    <div className="section filters">
        <h3>{i18next.t('sharpen.filters')}</h3>
        <div className="flex">
            <sp-action-button onClick={onUnsharpMaskButtonClicked}> {i18next.t('sharpen.unsharpen')} </sp-action-button>
            <sp-action-button onClick={onSelectiveFilterButtonClicked}> {i18next.t('sharpen.selective')} </sp-action-button>
        </div>
        <div className="flex">
            <sp-action-button onClick={onFreqSeparationFilterButtonClicked}># {i18next.t('sharpen.frequencySeparation')} </sp-action-button>
            <sp-action-button onClick={onMaskedFilterButtonClicked}># {i18next.t('sharpen.masked')} </sp-action-button>
        </div>
    </div>
);

async function onUnsharpMaskButtonClicked() {
    try {

        await core.executeAsModal(_executeUnsharpMask, {
            commandName: 'Unshark Mask'
        });

    } catch (err) {
        app.showAlert(err.message);
    }
}
async function _executeUnsharpMask() {

    const { sharpenOptions } = store.getState();
    const detail = BeautyPanel.layers.detail;

    if (detail && sharpenOptions.useDetailLayer) {
        await selectLayers([detail], true);
    }

    await filterUnsharpMask({
        dialogOptions: DialogOptions.Display,
        amount: 100,
        radius: 2,
        threshold: 0
    });

}

async function onSelectiveFilterButtonClicked() {
    try {

        await core.executeAsModal(executeSelectiveFilter, {
            commandName: 'Selective Filter'
        });

    } catch (err) {
        await handleException(err);
    }
}

async function onFreqSeparationFilterButtonClicked() {
    try {
        await core.executeAsModal(executeFreqSeparationFilter, {
            commandName: 'Frequency Separation Filter'
        });
    } catch (err) {
        await handleException(err);
    }
}

async function onMaskedFilterButtonClicked() {
    try {

        await core.executeAsModal(executeMaskedFilter, {
            commandName: 'Masked Filter'
        });

    } catch (err) {
        app.showAlert(err.message);
    }
}