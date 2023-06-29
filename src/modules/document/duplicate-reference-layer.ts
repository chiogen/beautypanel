import i18next from 'i18next';
import { app } from 'photoshop';
import type { Document } from 'photoshop/dom/Document';
import { BeautyPanel } from '../../common/beautypanel';
import { mergeLayers } from '../image/merge-layers';
import { selectLayers } from '../image/select-layers';

/**
 * This function does one of two things
 * 
 * If the document has a `detail` and `soft` layer, merge them together to a new layer.
 * 
 * Otherwise take the background layer and duplicate it.
 */
export async function duplicateReferenceLayer(document: Document) {

    const soft = BeautyPanel.layers.soft;
    const detail = BeautyPanel.layers.detail;

    if (soft && detail) {
        return await mergeLayers(document, [detail, soft]);
    }

    const referenceLayer = document.backgroundLayer;
    if (!referenceLayer)
        throw new Error(i18next.t('errors.noBackgroundLayer'));

    const newLayer = await referenceLayer.duplicate();
    if (!newLayer)
        throw new Error('errors.noDuplicateResult');

    return newLayer;
}

export async function duplicateReferenceLayerIntoSmartObject(document: Document) {
    const layer = await duplicateReferenceLayer(document);

    await selectLayers([layer]);

    await app.batchPlay([
        {
            _obj: 'newPlacedLayer'
        }
    ], {});

    return document.activeLayers[0];
}