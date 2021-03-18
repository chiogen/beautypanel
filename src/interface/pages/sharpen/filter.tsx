import * as React from 'react'
import i18next from 'i18next'
import { Heading } from '@adobe/react-spectrum'
import { filterUnsharpMask } from '../../../modules/filter/sharpen/unsharp-mask';
import { app } from 'photoshop';
import { DialogOptions } from '../../../enums/dialog-options';

export const Filter = () => (
    <div className="section filters">
        <Heading>{i18next.t('sharpen.filters')}</Heading>
        <div className="flex-buttons">
            <sp-action-button onClick={_executeUnsharpMask}># {i18next.t('sharpen.unsharpen')}</sp-action-button>
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

        const dialogOptions = e.altKey ? DialogOptions.Display : DialogOptions.DontDisplay;

        await filterUnsharpMask({
            dialogOptions
        });

    } catch(err) {
        app.showAlert(err.message);
    }
}

async function _executeSelectiveFilter(e: React.MouseEvent) {
    try {

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