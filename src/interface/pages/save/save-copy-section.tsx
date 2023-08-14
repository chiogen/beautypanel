import i18next from 'i18next';
import { core } from 'photoshop';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { handleException } from '../../../common/errors/handle-error';
import { Card } from '../../../components/card';
import { getLastScaleSize, saveScaledCopy, saveUnscaledCopy } from '../../../modules/actions/save';
import { TState } from '../../../store';

export const SaveCopySection = () => {
    const preferredSaveFormat = useSelector<TState, string>(state => state.save.preferredSaveFormat);
    const scaleWidth = String(getLastScaleSize() ?? '');

    return (
        <>
            <Card title={i18next.t('savePage.saveScaledCopyTo')}>
                <sp-action-button style={{ display: 'flex' }} onClick={onSaveScaledCopyButtonClicked}>
                    {i18next.t('savePage.saveScaledButtonText')} {preferredSaveFormat} {scaleWidth}
                </sp-action-button>
            </Card>
            <Card title={i18next.t('savePage.saveUnscaledCopyTo')}>
                <sp-action-button style={{ display: 'flex' }} onClick={onSaveUnscaledCopyButtonClicked}>
                    {i18next.t('savePage.saveUnscaledButtonText')} {preferredSaveFormat}
                </sp-action-button>
            </Card>
        </>
    );
};

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