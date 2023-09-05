import type { ActionButton } from '@spectrum-web-components/action-button';
import i18next from 'i18next';
import { app, core } from 'photoshop';
import * as React from 'react';
import { BeautyPanel, E_Layer } from '../../../common/beautypanel';
import { SeasonProfile, createSeasonEffect } from '../../../modules/actions/season-effect';
import { createSpringEffect } from '../../../modules/actions/spring-effect';

export const EffectsSeasonSection = () => {
    return (
        <div id="seasons" className="card">
            <h3>{i18next.t('effects.season.title')}</h3>
            <div className="flex-stack">
                <sp-action-button
                    onClick={onCreateSpringEffectButtonClicked}>{i18next.t('effects.season.spring')}</sp-action-button>
                <sp-action-button
                    onClick={onCreateAutumnEffectButtonClicked}>{i18next.t('effects.season.autumn')}</sp-action-button>
            </div>
        </div>
    );
};

async function onCreateAutumnEffectButtonClicked(e: React.MouseEvent<ActionButton>) {
    try {

        if (e.altKey) {
            await optAutumnEffect();
            return;
        }

        const profile: SeasonProfile = {
            layerOpacity: 100,
            colorCorrection: [
                {
                    color: 'reds',
                    cyan: 1,
                    magenta: 2,
                    yellow: 3,
                    black: 0
                },
                {
                    color: 'yellows',
                    cyan: -100,
                    magenta: 42,
                    yellow: 40,
                    black: 0
                },
                {
                    color: 'greens',
                    cyan: 100,
                    magenta: 100,
                    yellow: 100,
                    black: 100
                }
            ]
        };

        const opacity = localStorage.getItem('autumnLayerOpacity');
        const autumnLayerName = BeautyPanel.getLayerName(E_Layer.Autumn);

        if (opacity) {
            profile.layerOpacity = parseInt(opacity);
        }

        await core.executeAsModal(() => createSeasonEffect(autumnLayerName, profile), {
            commandName: i18next.t('effects.season.autumnEffectCommand')
        });

    } catch (err) {
        await app.showAlert(err.message);
    }
}
async function optAutumnEffect() {
    const key = 'autumnLayerOpacity';
    const layerName = BeautyPanel.getLayerName(E_Layer.Autumn);
    const layer = BeautyPanel.getLayerByCode(E_Layer.Autumn);

    if (layer) {
        localStorage.setItem(key, String(layer.opacity));
        await app.showAlert('Opacity value saved.');
    } else {
        await app.showAlert(i18next.t('layerNotFound', { name: layerName }));
    }

}

async function onCreateSpringEffectButtonClicked(_e: React.MouseEvent<ActionButton>) {
    try {

        if (_e.altKey) {
            await optSpringEffect();
            return;
        }

        await core.executeAsModal(() => createSpringEffect(), {
            commandName: i18next.t('effects.season.springEffectCommand')
        });

    } catch (err) {
        await app.showAlert(err.message);
    }
}
async function optSpringEffect() {
    const key = 'springLayerOpacity';
    const layerName = BeautyPanel.getLayerName(E_Layer.Spring);
    const layer = BeautyPanel.getLayerByCode(E_Layer.Spring);

    if (layer) {
        localStorage.setItem(key, String(layer.opacity));
        await app.showAlert('Opacity value saved.');
    } else {
        await app.showAlert(i18next.t('layerNotFound', { name: layerName }));
    }

}