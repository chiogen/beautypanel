import i18next from 'i18next';
import { app, constants } from 'photoshop';
import { BeautyPanel } from '../../common/beautypanel';
import { selectTool } from '../application/select-tool';
import { moveLayerToTop } from '../layer/move-layer-to-top';

export async function insertCopyright(text: string) {

    const document = app.activeDocument;
    if (!document) {
        throw new Error(i18next.t('errors.noDocumentActive'));
    }

    if (BeautyPanel.layers.copyright) {
        return;
    }

    const copyrightLayer = await document.createTextLayer({
        name: BeautyPanel.layerNames.copyright,
        contents: text,
        fontSize: 32
    });

    if (!copyrightLayer)
        throw new Error('Creating TextLayer error failed');

    // For some reason, creatTextLayer() uses the contents for layername instead of the name.
    copyrightLayer.name = BeautyPanel.layerNames.copyright;

    moveLayerToTop(copyrightLayer);

    await selectTool('moveTool');

    // throw new Error('[insertCopyright] Not implemented');
}