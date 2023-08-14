import i18next from 'i18next';
import { app, core } from 'photoshop';
import * as React from 'react';
import { executeEnhanceDetailsEffect } from '../../modules/actions/effects';
import { EffectsOrthonSection } from './effects/effects-orthon-section';
import { createVignette } from './effects/vignette';
import { EffectsSeasonSection } from './effects/effects.season-section';


export const EffectsPage = () => {
    return (
        <div id="effects" className="page">
            <EffectsOrthonSection />
            <sp-action-button onClick={onEnhanceDetailsButtonClicked}># {i18next.t('effects.enhanceDetails')}</sp-action-button>
            <sp-action-button onClick={onStrengthenDetailsButtonClicked}># {i18next.t('effects.strengthenDetails')}</sp-action-button>
            <sp-action-button onClick={onCreateVignetteButtonClicked}># {i18next.t('effects.vignette')}</sp-action-button>
            <EffectsSeasonSection />
        </div>
    );
};


async function onEnhanceDetailsButtonClicked() {

    if (!app.activeDocument)
        return;

    try {

        await core.executeAsModal(executeEnhanceDetailsEffect, {
            commandName: i18next.t('effects.enhanceDetails')
        });

    } catch (err) {
        const message = err.message || err;
        app.showAlert(message);
    }
}

async function onStrengthenDetailsButtonClicked() {
    try {

        throw new Error('Not implemented');

    } catch (err) {
        const message = err.message || err;
        app.showAlert(message);
    }
}

async function onCreateVignetteButtonClicked() {
    try {

        await core.executeAsModal(createVignette, {
            commandName: i18next.t('effects.vignette')
        });

    } catch (err) {
        await app.showAlert(err.message);
    }
}