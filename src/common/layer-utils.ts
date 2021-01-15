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

    export async function applyCalculation(source1: Layer, source2: Layer, channel: string, invert: boolean, mode: string, scale: number, offset: number) {

        const descriptor: ActionDescriptor =  {
            _obj: "calculation",
            _target: {
                _ref: "layer",
                _id: source1._id
            },
            to: {
                _ref: "channel",
                _enum: "channel",
                _value: "red"
            },
            invert,
            calculation: {
                _enum: "calculationType",
                _value: mode
            },
            scale,
            offset,
            // Target descriptor
            source2: {
                _ref: [
                    {
                        _ref: "channel",
                        _enum: "channel",
                        _value: "red"
                    },
                    {
                        _ref: "layer",
                        _id: source2._id
                    }
                ]
            },
            invertSource2: invert
        }

        const result = await app.batchPlay([descriptor], {});

        for (const item of result) {
            if (result.message) {
                app.showAlert(result.message);
            }
        }

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
