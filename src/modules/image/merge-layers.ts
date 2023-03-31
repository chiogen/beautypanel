import { app } from 'photoshop';
import { Document } from 'photoshop/dom/Document';
import { Layer } from 'photoshop/dom/Layer';
import { checkDescriptorError } from '../../common/errors/handle-error';
import { selectLayers } from './select-layers';

export async function mergeLayers(document: Document, layers: Layer[]): Promise<Layer> {

    const duplicates = await Promise.all(layers.map(async layer => layer.duplicate())) as Layer[];

    await selectLayers(duplicates);

    const [result] = await app.batchPlay([
        {
            _obj: 'mergeLayersNew'
        }
    ], {});

    // Delete duplicates if the command didn't already do it
    for (const layer of duplicates) {
        try {
            layer.delete();
        } catch {
            // Do nothing
        }
    }


    checkDescriptorError(result);

    return document.activeLayers[0];
}