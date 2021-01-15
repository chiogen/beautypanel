import { ActionDescriptor, app, Layer } from "photoshop";

export namespace LayerUtils {

    export async function desaturate(layer: Layer) {
        const descriptor: ActionDescriptor = {
            _obj: "desaturate",
            _target: {
                _ref: 'layer',
                _id: layer._id
            }
        }

        return app.batchPlay([descriptor], {});
    }

    export async function applyCalculation(layer: Layer, targetLayer: Layer, channel: string, invert: boolean, mode: string, scale: number, offset: number) {

    }

    export async function createContrastLayer(layer: Layer, rangeStart: number, rangeEnd: number): Promise<Layer> {
        return layer.duplicate();
    }

}