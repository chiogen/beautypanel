import * as React from 'react';
import * as path from 'path';
import i18next from 'i18next';
import { app, core } from 'photoshop';
import { replaceExtension } from '../../../common/path/replace-extension';
import { getFileForSaving } from '../../../common/fs/get-file-for-saving';
import { save } from '../../../modules/actions/save';
import { handleException } from '../../../common/errors/handle-error';
import { useSelector } from 'react-redux';
import { TState } from '../../../store';
import { Card } from '../../../components/card';

export const SaveCurrentPictureSection = () => {

    const width = useSelector<TState, number>(state => state.activeDocument.width);
    const height = useSelector<TState, number>(state => state.activeDocument.height);

    const path = useSelector<TState, string>(state => state.activeDocument.path);
    const ext = useSelector<TState, string>(state => state.activeDocument.extension);

    return (
        <Card title={i18next.t('savePage.currentPicture')}>
            <div className="document-information">
                <div className="row flex">
                    <span>{path ?? ''}</span>
                </div>
                <div className="row flex">
                    <span>{i18next.t('savePage.resolution')}</span>
                    <span>{width}x{height}</span>
                </div>
                <div className="row flex">
                    <span>{i18next.t('savePage.pictureTypeLabel')}</span>
                    <span>{ext}</span>
                </div>
            </div>
            <div className="flex stretch actions">
                <sp-action-button style={{ display: 'flex' }} onClick={quickSave}>{i18next.t('savePage.save')}</sp-action-button>
                <sp-action-button style={{ display: 'flex' }} onClick={saveAs}>{i18next.t('savePage.saveAs')}</sp-action-button>
            </div>
        </Card>
    );
};

async function quickSave() {
    try {

        if (!app.activeDocument) {
            return;
        }

        const document = app.activeDocument;

        await core.executeAsModal(async () => {
            await document.save();
        }, {
            commandName: 'Quicksave'
        });


    } catch (err) {
        await handleException(err);
    }
}

async function saveAs() {

    try {

        if (!app.activeDocument) {
            return;
        }

        const document = app.activeDocument;
        const documentFileName = path.basename(document.path);
        const suggestedFileName = replaceExtension(documentFileName, '.jpg');

        const file = await getFileForSaving(suggestedFileName);

        await core.executeAsModal(async () => {

            await save(document, file, true);

        }, {
            commandName: 'Save As'
        });

    } catch (err) {
        await handleException(err);
    }

}