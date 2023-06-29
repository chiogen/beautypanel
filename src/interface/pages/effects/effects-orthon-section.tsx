import i18next from 'i18next';
import * as React from 'react';
import { createOrthonEffectLayerFromV1, executeCreateOrthonLayer, executeOrthonEffectSmart } from '../../../modules/actions/effects';
import { app, core } from 'photoshop';
import { handleException } from '../../../common/errors/handle-error';

export const EffectsOrthonSection = () => {
    return (
        <div className='section'>
            <h3>{i18next.t('effects.orton')}</h3>
            <div className="orthon-effect flex stack">
                <sp-action-button onClick={triggerLegacyOrthonEffect}>{i18next.t('effects.ortonFromOldVersion')}</sp-action-button>
                <div className="helper-text">
                    Gaussian Blur + Reveal All Mask
                </div>
            </div>
            <div className="orthon-effect flex stack">
                <sp-action-button onClick={triggerOrthonEffect}>{i18next.t('effects.orton')}</sp-action-button>
                <div className="helper-text">
                    Gaussian Blur + Adjustment Layer
                </div>
            </div>
            <div className="orthon-effect flex stack">
                <sp-action-button onClick={triggerOrthonEffectSmart}>{i18next.t('effects.ortonWithSmartObjects')}</sp-action-button>
                <div className="helper-text">
                    Gaussian Blur (Smart Object) + High Pass (Smart Object)
                </div>
            </div>
        </div>
    );
};


const createOrthonVariant = (variant: () => Promise<void>) => async () => {
    try {

        if (!app.activeDocument)
            return;

        await core.executeAsModal(variant, {
            commandName: i18next.t('effects.orton')
        });

    } catch (err) {
        handleException(err);
    }
};

const triggerLegacyOrthonEffect = createOrthonVariant(createOrthonEffectLayerFromV1);
const triggerOrthonEffect = createOrthonVariant(executeCreateOrthonLayer);
const triggerOrthonEffectSmart = createOrthonVariant(executeOrthonEffectSmart);