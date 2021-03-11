import { ActionDescriptor, app, Layer, PercentValue } from "photoshop";
import { DocumentUtils } from "./document-utils";
import { percent, pixels } from "./units";

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

    export async function applyMedianFilter(layer: Layer, radius: number) {
        const descriptor: ActionDescriptor = {
            _obj: "median",
            radius: pixels(radius)
        }

        const result = await app.batchPlay([
            {
                _obj: 'select',
                _target: {
                    _ref: 'layer',
                    _id: layer._id
                },
                makeVisible: true
            },
            descriptor
        ]);

        for (const item of result) {
            if (item.message) {
                await app.showAlert(item.message);
            }
        }
    }

    export type ImageCalculationType = 'normal' |
        'add' | 'subtract' |
        'darken' | 'multiply' | 'colorBurn' | 'linearBurn' | 'darkerColor' |
        'lighten' | 'screen' | 'colorDodge' | 'linearDodge' | 'linearDodgeAdd' | 'lighterColor' |
        'overlay' | 'softLight' | 'hardLight' | 'vividLight' | 'linearLight' | 'pinLight' | 'hardMix' |
        'difference' | 'exclusion' | 'divide';
    export interface ApplyImageEventOptions {
        source: Layer
        target: Layer
        channel: string
        scale: number
        offset: number
        opacity?: PercentValue
        calculationType: ImageCalculationType
        invert: boolean
    }
    export async function applyImageEvent(options: ApplyImageEventOptions) {

        const descriptor: ActionDescriptor = {
            _obj: "applyImageEvent",
            with: {
                _obj: "calculation",
                to: {
                    _ref: [
                        {
                            _ref: "channel",
                            _enum: "channel",
                            _value: options.channel
                        },
                        {
                            _ref: "layer",
                            _id: options.source._id
                        }
                    ]
                },
                invert: options.invert,
                calculation: {
                    _enum: "calculationType",
                    _value: options.calculationType
                },
                scale: 2,
                offset: 0
            }
        };

        const result = await app.batchPlay([
            {
                _obj: 'select',
                _target: {
                    _ref: 'layer',
                    _id: options.target._id
                },
                makeVisible: true
            },
            descriptor
        ], {});

        for (const item of result) {
            if (item.message) {
                await app.showAlert(item.message);
            }
        }

    }

    export async function createContrastLayer(source: Layer, rangeStart: number, rangeEnd: number): Promise<Layer> {

        const createLevelsLayer: ActionDescriptor = {
            _obj: "make",
            _target: [
                {
                    "_ref": "adjustmentLayer"
                }
            ],
            using: {
                _obj: "adjustmentLayer",
                type: {
                    _obj: "levels",
                    presetKind: {
                        _enum: "presetKindType",
                        _value: "presetKindDefault"
                    }
                }
            }
        };
        const addInput: ActionDescriptor = {
            _obj: "set",
            _target: [
                {
                    _ref: "adjustmentLayer",
                    _enum: "ordinal",
                    _value: "targetEnum"
                }
            ],
            to: {
                _obj: "levels",
                presetKind: {
                    _enum: "presetKindType",
                    _value: "presetKindCustom"
                },
                adjustment: [
                    {
                        _obj: "levelsAdjustment",
                        channel: {
                            _ref: "channel",
                            _enum: "channel",
                            _value: "composite"
                        },
                        input: [
                            rangeStart,
                            rangeEnd
                        ]
                    }
                ]
            }
        }

        const result = await app.batchPlay([
            DocumentUtils._selectLayers([source]),
            createLevelsLayer,
            addInput
        ], {});

        for (const item of result) {
            if (item.message) {
                await app.showAlert(item.message);
            }
        }

        // Usually, the now active layer is the new layer
        return app.activeDocument!.activeLayers[0];
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

        const descriptor: ActionDescriptor = {
            _obj: 'make',
            new: {
                "_class": "channel"
            },
            at: {
                _ref: "channel",
                _enum: "channel",
                _value: "mask"
            },
            using: {
                _enum: "userMaskEnabled",
                _value: "revealAll"
            }
        }

        const result = await app.batchPlay([
            DocumentUtils._selectLayers([layer]),
            descriptor
        ], {});

        for (const item of result) {
            if (item.message) {
                await app.showAlert(item.message);
            }
        }

    }

    export async function unsharpMask(amount?: number, radius?: number, threshold?: number) {
        const descriptor: ActionDescriptor = {
            _obj: "unsharpMask"
        };

        if (typeof amount === 'number') {
            descriptor.amount = percent(amount);
        }

        if (typeof radius === 'number') {
            descriptor.radius = pixels(radius);
        }

        if (typeof threshold === 'number') {
            descriptor.threshold = threshold;
        }

        const [result] = await app.batchPlay([descriptor]);
        if (result.message) {
            throw new Error(result.message);
        }
    }

}
