import i18next from 'i18next';
import { app, core } from 'photoshop';
import * as React from 'react';
import { executeFrequencySeparation, selectLayerDetailsForFrequencySeparation, selectLayerSoftForFrequencySeparation } from '../../../modules/actions/frequency-separation';
import { Card } from '../../../components/card';

export const FrequencySeparation = () => (
    <Card title={i18next.t('frequencySeparation.long')} contentStyle='inline-stretch'>
        <sp-action-button onClick={onFrequencySeparationClicked}>{i18next.t('frequencySeparation.short')}</sp-action-button>
        <div className="flex stretch">
            <sp-action-button onClick={onSelectLayerDetailsClicked}>{i18next.t('frequencySeparation.details')}</sp-action-button>
            <sp-action-button onClick={onSelectLayerSoftClicked}>{i18next.t('frequencySeparation.soft')}</sp-action-button>
        </div>
    </Card>
);

async function onFrequencySeparationClicked(e?: React.MouseEvent) {

    const button = (e?.currentTarget ?? e?.target) as HTMLButtonElement | undefined;

    try {

        if (button) {
            button.disabled = true;
        }

        await core.executeAsModal(executeFrequencySeparation, {
            commandName: 'Frequency Separation'
        });

    } catch (err) {
        console.error(err);
        app.showAlert(err.message || err);
    } finally {
        if (button) {
            button.disabled = false;
        }
    }

}

async function onSelectLayerDetailsClicked() {
    try {

        await core.executeAsModal(selectLayerDetailsForFrequencySeparation, {
            commandName: 'Select Layer Details'
        });

    } catch (err) {
        console.error(err);
        app.showAlert(err.message || err);
    }
}

async function onSelectLayerSoftClicked() {
    try {

        await core.executeAsModal(selectLayerSoftForFrequencySeparation, {
            commandName: 'Select Layer Details'
        });

    } catch (err) {
        console.error(err);
        app.showAlert(err.message || err);
    }
}