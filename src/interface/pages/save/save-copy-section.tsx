import i18next from 'i18next';
import * as path from 'path';
import { app, core } from 'photoshop';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { handleException } from '../../../common/errors/handle-error';
import { getLastScaleSize, saveScaledCopy, saveUnscaledCopy } from '../../../modules/actions/save';
import { TState } from '../../../store';

export const SaveCopySection = () => {
    const preferredSaveFormat = useSelector<TState, string>(state => state.save.preferredSaveFormat);

    const scaleWidth = String(getLastScaleSize() ?? '');
    const saveFolder = getCopyOutputFolder();

    return (
        <div className="section">
            <h3>{i18next.t('savePage.saveScaledCopyTo')}</h3>
            <sp-action-button style={{ display: 'flex' }} onClick={onSaveScaledCopyButtonClicked}>
                {i18next.t('savePage.saveScaledButtonText')} {preferredSaveFormat} {scaleWidth}
            </sp-action-button>
            <h3>{i18next.t('savePage.saveUnscaledCopyTo')}</h3>
            <sp-action-button style={{ display: 'flex' }} onClick={onSaveUnscaledCopyButtonClicked}>
                {i18next.t('savePage.saveUnscaledButtonText')} {preferredSaveFormat}
            </sp-action-button>
            <div className="output-dir flex">
                <span> {i18next.t('savePage.outputFolder')} {saveFolder} </span>
            </div>
        </div>
    );
};

function getCopyOutputFolder() {
    if (app.activeDocument?.path) {
        return path.parse(app.activeDocument.path).dir;
    }
}

async function onSaveScaledCopyButtonClicked() {
    try {

        await core.executeAsModal(saveScaledCopy, {
            commandName: 'Save scaled copy'
        });

    } catch (err) {
        await handleException(err);
    }
}
async function onSaveUnscaledCopyButtonClicked() {
    try {

        await core.executeAsModal(saveUnscaledCopy, {
            commandName: 'Save unscaled copy'
        });

    } catch (err) {
        await handleException(err);
    }
}