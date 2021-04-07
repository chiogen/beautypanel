import { ActionDescriptor, app, Layer } from "photoshop";


export function _selectLayers(layers: Layer[], makeVisible: boolean = false): ActionDescriptor {

    const layerIds = layers.map(x => x._id);
    const firstLayer = layers[0];

    const descriptor: ActionDescriptor = {
        _obj: 'select',
        _target: {
            _ref: 'layer',
            _id: firstLayer._id
        },
        makeVisible: makeVisible,
        layerID: layerIds
    };

    return descriptor;
}

export async function selectLayers(layers: Layer[], makeVisible: boolean = false): Promise<void> {

    if (layers.length === 0)
        return;

    const descriptor = _selectLayers(layers, makeVisible);
    await app.batchPlay([
        descriptor
    ], {});
}