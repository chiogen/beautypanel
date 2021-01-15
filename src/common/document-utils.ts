import { ActionDescriptor, app, Layer } from "photoshop";

export namespace DocumentUtils {

    export async function checkBitsPerChannel() {
        // Not implemented yet
    }

    export async function selectNoLayers() {
        await app.batchPlay([
            {
                _obj: "selectNoLayers",
                _target: [
                    {
                        _ref: "layer",
                        _enum: "ordinal",
                        _value: "targetEnum"
                    }
                ]
            }
        ], {})
    }

    export async function setActiveLayers(layers: Layer[]): Promise<void> {

        if (layers.length === 0)
            return;

        const layerIds = layers.map(x => x._id);
        const firstLayer = layers[0];

        const descriptor: ActionDescriptor = {
            _obj: 'select',
            _target: {
                _ref: 'layer',
                _id: firstLayer._id
            },
            makeVisible: false,
            layerID: layerIds
        };

        await app.batchPlay([descriptor], {});
    }

}