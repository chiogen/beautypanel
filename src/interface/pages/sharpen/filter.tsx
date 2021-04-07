import * as React from 'react'
import i18next from 'i18next'
import { Heading } from '@adobe/react-spectrum'
import { filterUnsharpMask } from '../../../modules/filter/sharpen/unsharp-mask';
import { app, Layer } from 'photoshop';
import { DialogOptions } from '../../../enums/dialog-options';
import { filterSmartSharpen } from '../../../modules/filter/sharpen/smart-sharpen';
import { BeautyPanel, E_Layer } from '../../../common/beautypanel';
import { executeFrequencySeparation } from '../tools/frequency-separation';
import { imageDesaturation } from '../../../modules/image/desaturate';
import { imageCalculation } from '../../../modules/image/calculation';
import { store } from '../../../store';
import { selectLayers } from '../../../modules/image/select-layers';
import { mergeLayers } from '../../../modules/image/merge-layers';

export const Filter = () => (
    <div className="section filters">
        <Heading>{i18next.t('sharpen.filters')}</Heading>
        <div className="flex-buttons">
            <sp-action-button onClick={_executeUnsharpMask}>{i18next.t('sharpen.unsharpen')}</sp-action-button>
            <sp-action-button onClick={_executeSelectiveFilter}>{i18next.t('sharpen.selective')}</sp-action-button>
        </div>
        <div className="flex-buttons">
            <sp-action-button onClick={_executeFreqSeparationFilter}># {i18next.t('sharpen.frequencySeparation')}</sp-action-button>
            <sp-action-button onClick={_executeMaskedFilter}># {i18next.t('sharpen.masked')}</sp-action-button>
        </div>
    </div>
);

async function _executeUnsharpMask(e: React.MouseEvent) {
    try {

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

    } catch(err) {
        app.showAlert(err.message);
    }
}

async function _executeSelectiveFilter(e: React.MouseEvent) {
    try {

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

    } catch(err) {
        app.showAlert(err.message);
    }
}

async function _executeFreqSeparationFilter(e: React.MouseEvent) {
    try {

        let document = app.activeDocument;
        if (!document) {
            return;
        }

        let detail = BeautyPanel.layers.detail;
        let soft = BeautyPanel.layers.soft;

        // Run frequency separation if it isn't done yet
        if (!detail || !soft) {
            await executeFrequencySeparation(e);
            detail = BeautyPanel.layers.detail!;
            soft = BeautyPanel.layers.soft!;
        }

        let detailBlackWhite = await detail.duplicate(undefined, BeautyPanel.getLayerName(E_Layer.DetailBlackWhite));
        let detailColor = detail;
        detailColor.name = BeautyPanel.getLayerName(E_Layer.DetailColor);

        detailBlackWhite.blendMode = 'linearLight';
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

    } catch(err) {
        app.showAlert(err.message);
    }
}


async function _executeMaskedFilter(e: React.MouseEvent) {
    try {

        const { sharpenOptions } = store.getState();
        const detail = BeautyPanel.layers.detail;

        if (detail && sharpenOptions.useDetailLayer) {
            await selectLayers([detail], true);
        }

    } catch(err) {
        app.showAlert(err.message);
    }
}