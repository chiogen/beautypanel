import i18next from 'i18next';
import { app, core } from 'photoshop';
import * as React from 'react';
import { BeautyPanel, E_Layer } from '../../common/beautypanel';
import { executeCreateOrthonLayer, executeEnhanceDetailsEffect } from '../../modules/actions/effects';
import { createSeasonEffect, SeasonProfile } from '../../modules/actions/season-effect';
import { createVignette } from './effects/vignette';
import { useSelector } from 'react-redux';
import { TState } from '../../store';
import { Page } from '../../enums';

type Props = {
    isActive: boolean
};

export const EffectsPage = () => {

    const isActive = useSelector((state: TState) => state.page === Page.Effects);

    const style: React.CSSProperties = {};
    if (!isActive) {
        style.display = 'none';
    }

    return (
        <div id="effects" className="page" style={style}>
            <sp-action-button onClick={onEnhanceDetailsButtonClicked}># {i18next.t('effects.enhanceDetails')}</sp-action-button>
            <sp-action-button onClick={onStrengthenDetailsButtonClicked}># {i18next.t('effects.strengthenDetails')}</sp-action-button>
            <sp-action-button onClick={onCreateOrthonEffectButtonClicked}># {i18next.t('effects.orton')}</sp-action-button>
            <sp-action-button onClick={onCreateVignetteButtonClicked}># {i18next.t('effects.vignette')}</sp-action-button>
            <sp-action-button onClick={onCreateAutumnEffectButtonClicked}>{i18next.t('effects.autumn')}</sp-action-button>
            <sp-action-button onClick={onCreateSpringEffectButtonClicked}># {i18next.t('effects.spring')}</sp-action-button>
        </div>
    );
}

export class Effects extends React.Component<Props> {

    render() {

        const style: React.CSSProperties = {};
        if (!this.props.isActive) {
            style.display = 'none';
        }

        return <div id="effects" className="page" style={style}>
            <sp-action-button onClick={onEnhanceDetailsButtonClicked}># {i18next.t('effects.enhanceDetails')}</sp-action-button>
            <sp-action-button onClick={onStrengthenDetailsButtonClicked}># {i18next.t('effects.strengthenDetails')}</sp-action-button>
            <sp-action-button onClick={onCreateOrthonEffectButtonClicked}># {i18next.t('effects.orton')}</sp-action-button>
            <sp-action-button onClick={onCreateVignetteButtonClicked}># {i18next.t('effects.vignette')}</sp-action-button>
            <sp-action-button onClick={onCreateAutumnEffectButtonClicked}>{i18next.t('effects.autumn')}</sp-action-button>
            <sp-action-button onClick={onCreateSpringEffectButtonClicked}># {i18next.t('effects.spring')}</sp-action-button>
        </div>;
    }

}

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

async function onCreateOrthonEffectButtonClicked() {
    try {

        if (!app.activeDocument)
            return;

        await core.executeAsModal(executeCreateOrthonLayer, {
            commandName: i18next.t('effects.orton')
        });

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

export async function onCreateAutumnEffectButtonClicked(e: React.MouseEvent<HTMLButtonElement>) {
    try {

        if (e.altKey) {
            optAutumnEffect();
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
            commandName: i18next.t('effects.autumn')
        });

    } catch (err) {
        app.showAlert(err.message);
    }
}
function optAutumnEffect() {
    const key = 'autumnLayerOpacity';
    const layerName = BeautyPanel.getLayerName(E_Layer.Autumn);
    const layer = BeautyPanel.getLayerByCode(E_Layer.Autumn);

    if (layer) {
        localStorage.setItem(key, String(layer.opacity));
        app.showAlert('Opacity value saved.');
    } else {
        app.showAlert(i18next.t('layerNotFound', { name: layerName }));
    }

}

export async function onCreateSpringEffectButtonClicked(_e: React.MouseEvent<HTMLButtonElement>) {
    try {

        throw new Error('No profile defined.');

        if (_e.altKey) {
            optAutumnEffect();
            return;
        }

        // const profile = springToAutumn;
        // const opacity = localStorage.getItem('springLayerOpacity');
        // if (opacity) {
        //     profile.layerOpacity = parseInt(opacity);
        // }

        // await createSeasonEffect(BeautyPanel.getLayerName(E_Layer.Spring), profile);

    } catch (err) {
        app.showAlert(err.message);
    }
}
function optSpringEffect() {
    const key = 'springLayerOpacity';
    const layerName = BeautyPanel.getLayerName(E_Layer.Autumn);
    const layer = BeautyPanel.getLayerByCode(E_Layer.Autumn);

    if (layer) {
        localStorage.setItem(key, String(layer.opacity));
        app.showAlert('Opacity value saved.');
    } else {
        app.showAlert(i18next.t('layerNotFound', { name: layerName }));
    }

}