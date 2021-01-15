import { ActionDescriptor, app, Layer } from "photoshop";
import { pixels } from "./type-utils";

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

    export async function applyMedianNoise(layer: Layer, radius: number) {
        const descriptor: ActionDescriptor = {
            _obj: "median",
            _target: {
                _ref: 'layer',
                _id: layer._id
            },
            radius: pixels(radius)
        }

        return app.batchPlay([descriptor], {});
    }

    export async function applyCalculation(layer: Layer, targetLayer: Layer, channel: string, invert: boolean, mode: string, scale: number, offset: number) {

    }

    export async function createContrastLayer(rangeStart: number, rangeEnd: number): Promise<Layer> {

        const descriptor: ActionDescriptor = {
            _obj: "make",
            _target: {
                _ref: "adjustmentLayer"
            },
            using: {
                _obj: "adjustmentLayer",
                type: {
                    _obj: "brightnessEvent",
                    useLegacy: false
                }
            }
        }

        const result = await app.batchPlay([descriptor], {});

        for (const item of result) {
            if (result.message) {
                app.showAlert(result.message);
            }
        }
        
        // Usually, the now active layer is the new layer
        return app.activeDocument.activeLayers[0];
    }

}
