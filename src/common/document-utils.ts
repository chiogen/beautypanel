import { ActionDescriptor, app, Document, Layer } from "photoshop";

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

    export async function mergeLayers(document: Document, layers: Layer[]): Promise<Layer> {

        // The last layer will be the remaining layer, where all is merged to
        const lastLayer = layers[layers.length - 1];

        for (const layer of layers) {
            if (layer !== lastLayer) {
                lastLayer.moveAbove(layer);
            }
        }

        for (const layer of document.layers) {
            layer.visible = layers.includes(layer);
        }

        app.activeDocument.mergeVisibleLayers()
        return lastLayer;
    }

}