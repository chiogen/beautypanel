import i18next from 'i18next';
import { app, core } from 'photoshop';
import * as React from 'react';
import { handleException } from '../../../common/errors/handle-error';
import { executeDodgeAndBurn, executeDodgeAndBurnWithGradient } from '../../../modules/actions/dodge-and-burn';
import { useDodgeAndBurnColor } from '../../../reducer/tools';
import { store } from '../../../store';
import { DodgeAndBurnColorSelection } from './dodge-and-burn-color-selection';
import { DodgeAndBurnToolSelection } from './dodge-and-burn-tool-selection';


export const DodgeAndBurn = () => {
    return (
        <div id="dodge-and-burn-section" className="section">
            <h3 className="title">Dodge and Burn</h3>
            <div id="dodge-and-burn">
                <div className="flex stretch">
                    <sp-action-button onClick={excecuteWithGradient}># {i18next.t('dodgeAndBurn.gradient')}</sp-action-button>
                    <sp-action-button onClick={execute}>{i18next.t('dodgeAndBurn.default')}</sp-action-button>
                </div>
                <DodgeAndBurnColorSelection />
                <DodgeAndBurnToolSelection />
            </div>
        </div>
    );
};

async function execute() {

    if (!app.activeDocument) {
        return;
    }

    try {

        await core.executeAsModal(executeDodgeAndBurn, {
            commandName: 'Dodge And Burn'
        });

        store.dispatch(useDodgeAndBurnColor('white'));

    } catch (err) {
        await handleException(err);
    }

}

async function excecuteWithGradient() {

    if (!app.activeDocument) {
        return;
    }

    try {

        await core.executeAsModal(executeDodgeAndBurnWithGradient, {
            commandName: 'Dodge And Burn (With Gradient)'
        });

    } catch (err) {
        await handleException(err);
    }

}