import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { Layer } from 'photoshop/dom/Layer';
import { checkDescriptorError } from '../../common/errors/handle-error';


export function _selectLayers(layers: Layer[], makeVisible = false): ActionDescriptor {

    const layerIds = layers.map(x => x.id);
    const firstLayer = layers[0];

    const descriptor: ActionDescriptor = {
        _obj: 'select',
        _target: {
            _ref: 'layer',
            _id: firstLayer.id
        },
        makeVisible: makeVisible,
        layerID: layerIds
    };

    return descriptor;
}

export async function selectLayers(layers: Layer[], makeVisible = false): Promise<void> {

    if (layers.length === 0)
        return;

    const descriptor = _selectLayers(layers, makeVisible);
    const [result] = await app.batchPlay([
        descriptor
    ], {});

    checkDescriptorError(result);
}