import i18next from 'i18next';
import type { Document } from 'photoshop/dom/Document';
import { BeautyPanel } from '../../common/beautypanel';
import { mergeLayers } from '../image/merge-layers';
import { _selectLayers } from '../image/select-layers';
import { app } from 'photoshop';

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
        const detailCopy = await detail.duplicate();
        const softCopy = await soft.duplicate();
        return await mergeLayers(document, [detailCopy!, softCopy!]);
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

    await app.batchPlay([
        _selectLayers([layer]),
        {
            _obj: 'newPlacedLayer'
        }
    ], {});

    return document.activeLayers[0];
}