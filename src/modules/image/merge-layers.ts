import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { Document } from 'photoshop/dom/Document';
import { Layer } from 'photoshop/dom/Layer';
import { checkDescriptorError } from '../../common/errors/handle-error';
import { selectLayers } from './select-layers';

export async function mergeLayers(document: Document, layers: Layer[], name?: string): Promise<Layer> {

    const duplicates = await duplicateLayers(layers);
    await selectLayers(duplicates, true);

    await mergeLayersNew();
    const mergedLayer = document.activeLayers[0];

    mergedLayer.name = name ?? 'New Merged Layer';
    return mergedLayer;
}

async function duplicateLayers(layers: Layer[]) {

    const duplicates: Layer[] = [];

    for (const layer of layers) {
        const newLayer = await layer.duplicate();
        if (!newLayer)
            throw new Error(`Layer "${layer.name}" didnt get duplicated.`);
        duplicates.push(newLayer);
    }

    return duplicates;
}


function _mergeLayersNew() {
    return {
        _obj: 'mergeLayersNew',
    } as ActionDescriptor;
}
async function mergeLayersNew() {
    const [result] = await app.batchPlay([
        _mergeLayersNew()
    ], {});

    checkDescriptorError(result);
}