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

        const result = await app.batchPlay([descriptor], {});

        for (const item of result) {
            if (item.message) {
                await app.showAlert(item.message);
            }
        }
    }

    export async function invert(layer: Layer) {
        const descriptor: ActionDescriptor = {
            _obj: "invert",
            _target: {
                _ref: 'layer',
                _id: layer._id
            }
        }

        const result = await app.batchPlay([descriptor], {});

        for (const item of result) {
            if (item.message) {
                await app.showAlert(item.message);
            }
        }
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

        const result = await app.batchPlay([descriptor], {});

        for (const item of result) {
            if (item.message) {
                await app.showAlert(item.message);
            }
        }
    }

    export async function applyCalculation(source1: Layer, source2: Layer, channel: string, invert: boolean, mode: string, scale: number, offset: number) {

        // make {
        //     "new": {
        //      "_class": "channel"
        //     },
        //     "using": {
        //      "_obj": "calculation",
        //      "to": {
        //       "_ref": [
        //        {
        //         "_ref": "channel",
        //         "_enum": "channel",
        //         "_value": "red"
        //        },
        //        {
        //         "_ref": "layer",
        //         "_name": "Soft"
        //        }
        //       ]
        //      },
        //      "calculation": {
        //       "_enum": "calculationType",
        //       "_value": "add"
        //      },
        //      "scale": 1,
        //      "offset": 0,
        //      "opacity": {
        //       "_unit": "percentUnit",
        //       "_value": 90
        //      },
        //      "source2": {
        //       "_ref": "channel",
        //       "_enum": "channel",
        //       "_value": "red"
        //      },
        //      "invertSource2": true
        //     },
        //     "_isCommand": true
        //    }

        // const descriptor: ActionDescriptor = {
        //     _obj: "calculation",
        //     _target: {
        //         _ref: "layer",
        //         _id: source1._id
        //     },
        //     to: {
        //         _ref: "channel",
        //         _enum: "channel",
        //         _value: "red"
        //     },
        //     invert,
        //     calculation: {
        //         _enum: "calculationType",
        //         _value: mode
        //     },
        //     scale,
        //     offset,
        //     // Target descriptor
        //     source2: {
        //         _ref: [
        //             {
        //                 _ref: "channel",
        //                 _enum: "channel",
        //                 _value: "red"
        //             },
        //             {
        //                 _ref: "layer",
        //                 _id: source2._id
        //             }
        //         ]
        //     },
        //     invertSource2: invert
        // }

        const descriptor: ActionDescriptor = {
            _obj: "make",
            new: {
                _class: "channel"
            },
            using: {
                _obj: "calculation",
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
                source2: {
                    _ref: [
                        {
                            _ref: "layer",
                            _id: source2._id
                        }
                    ]
                },
                invertSource2: invert
            },
            _isCommand: true
        };

        const result = await app.batchPlay([descriptor], {});

        for (const item of result) {
            if (item.message) {
                await app.showAlert(item.message);
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
            if (item.message) {
                await app.showAlert(item.message);
            }
        }

        // Usually, the now active layer is the new layer
        return app.activeDocument.activeLayers[0];
    }

    export async function applySurfaceBlur(layer: Layer, radius: number, threshold: number) {
        const descriptor: ActionDescriptor = {
            _obj: "surfaceBlur",
            _target: {
                _ref: 'layer',
                _id: layer._id
            },
            radius: pixels(radius),
            threshold: threshold
        };

        const result = await app.batchPlay([descriptor], {});

        for (const item of result) {
            if (item.message) {
                await app.showAlert(item.message);
            }
        }
    }

    export async function createRvlaMask(layer: Layer) {

    }

}
