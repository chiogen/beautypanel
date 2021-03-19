import * as React from 'react'
import i18next from 'i18next'
import { Heading } from '@adobe/react-spectrum'
import { filterUnsharpMask } from '../../../modules/filter/sharpen/unsharp-mask';
import { app } from 'photoshop';
import { DialogOptions } from '../../../enums/dialog-options';
import { filterSmartSharpen } from '../../../modules/filter/sharpen/smart-sharpen';

export const Filter = () => (
    <div className="section filters">
        <Heading>{i18next.t('sharpen.filters')}</Heading>
        <div className="flex-buttons">
            <sp-action-button onClick={_executeUnsharpMask}>{i18next.t('sharpen.unsharpen')}</sp-action-button>
            <sp-action-button onClick={_executeSelectiveFilter}># {i18next.t('sharpen.selective')}</sp-action-button>
        </div>
        <div className="flex-buttons">
            <sp-action-button onClick={_executeFreqSeparationFilter}># {i18next.t('sharpen.frequencySeparation')}</sp-action-button>
            <sp-action-button onClick={_executeMaskedFilter}># {i18next.t('sharpen.masked')}</sp-action-button>
        </div>
    </div>
);

async function _executeUnsharpMask(e: React.MouseEvent) {
    try {

        // const dialogOptions = e.altKey ? DialogOptions.Display : DialogOptions.DontDisplay;

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

        // const dialogOptions = e.altKey ? DialogOptions.Display : DialogOptions.DontDisplay;

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

    } catch(err) {
        app.showAlert(err.message);
    }
}

async function _executeMaskedFilter(e: React.MouseEvent) {
    try {

    } catch(err) {
        app.showAlert(err.message);
    }
}