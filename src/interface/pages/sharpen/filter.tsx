import i18next from 'i18next';
import { app, constants, core } from 'photoshop';
import * as React from 'react';
import { BeautyPanel, E_Layer } from '../../../common/beautypanel';
import { DialogOptions } from '../../../enums/dialog-options';
import { executeFrequencySeparation } from '../../../modules/actions/frequency-separation';
import { filterSmartSharpen } from '../../../modules/filter/sharpen/smart-sharpen';
import { filterUnsharpMask } from '../../../modules/filter/sharpen/unsharp-mask';
import { imageCalculation } from '../../../modules/image/calculation';
import { imageDesaturation } from '../../../modules/image/desaturate';
import { mergeLayers } from '../../../modules/image/merge-layers';
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

        await core.executeAsModal(_executeSelectiveFilter, {
            commandName: 'Selective Filter'
        });

    } catch (err) {
        app.showAlert(err.message);
    }
}
async function _executeSelectiveFilter() {

    const { sharpenOptions } = store.getState();
    const detail = BeautyPanel.layers.detail;

    if (detail && sharpenOptions.useDetailLayer) {
        await selectLayers([detail], true);
    }

    await filterSmartSharpen({
        amount: 100,
        radius: 2,
        noiseReduction: 20,
        shadowMode: {
            amount: 20,
            width: 50,
            radius: 20
        },
        highlightMode: {
            amount: 20,
            width: 50,
            radius: 20
        },
        dialogOptions: DialogOptions.Display
    });

}

async function onFreqSeparationFilterButtonClicked() {
    try {
        await core.executeAsModal(_executeFreqSeparationFilter, {
            commandName: 'Frequency Separation Filter'
        });
    } catch (err) {
        app.showAlert(err.message);
    }
}
async function _executeFreqSeparationFilter() {
    const document = app.activeDocument;
    if (!document) {
        return;
    }

    let detail = BeautyPanel.layers.detail;
    let soft = BeautyPanel.layers.soft;

    // Run frequency separation if it isn't done yet
    if (!detail || !soft) {
        await executeFrequencySeparation();
        detail = BeautyPanel.layers.detail!;
        soft = BeautyPanel.layers.soft!;
    }

    const detailBlackWhite = await detail.duplicate();
    if (!detailBlackWhite)
        throw new Error('Photoshop did not duplicate "DetailBlackWhite" layer.');

    const detailColor = detail;
    detailColor.name = BeautyPanel.getLayerName(E_Layer.DetailColor);

    detailBlackWhite.name = BeautyPanel.getLayerName(E_Layer.DetailBlackWhite);
    detailBlackWhite.blendMode = constants.BlendMode.LINEARLIGHT;
    await imageDesaturation(detailBlackWhite);
    await imageCalculation({
        sourceLayer: detailColor,
        targetLayer: detailBlackWhite,
        calculationType: 'add',
        channel: 'RGB',
        invert: true,
        scale: 2,
        offset: 0
    });

    await selectLayers([detailBlackWhite]);
    await filterUnsharpMask({
        dialogOptions: DialogOptions.Display
    });

    const mergedLayer = await mergeLayers(document, [
        detailBlackWhite,
        detailColor,
        soft
    ]);

    mergedLayer.delete();

}

async function onMaskedFilterButtonClicked() {
    try {

        await core.executeAsModal(_executeMaskedFilter, {
            commandName: 'Masked Filter'
        });

    } catch (err) {
        app.showAlert(err.message);
    }
}
async function _executeMaskedFilter() {

    const { sharpenOptions } = store.getState();
    const detail = BeautyPanel.layers.detail;

    if (detail && sharpenOptions.useDetailLayer) {
        await selectLayers([detail], true);
    }

}