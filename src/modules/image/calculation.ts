import { ActionDescriptor, Layer, PercentValue } from "photoshop";
import { app } from "photoshop";
import { DocumentUtils } from "../../common/document-utils";

export type ImageCalculationType = 'normal' |
    'add' | 'subtract' |
    'darken' | 'multiply' | 'colorBurn' | 'linearBurn' | 'darkerColor' |
    'lighten' | 'screen' | 'colorDodge' | 'linearDodge' | 'linearDodgeAdd' | 'lighterColor' |
    'overlay' | 'softLight' | 'hardLight' | 'vividLight' | 'linearLight' | 'pinLight' | 'hardMix' |
    'difference' | 'exclusion' | 'divide';

export interface ImageCalculationOptions {
    layer: Layer
    targetLayer: Layer
    calculationType: ImageCalculationType
    channel: string
    scale?: number
    offset?: number
    invert?: boolean
}

export function _imageCalculation(options: ImageCalculationOptions): ActionDescriptor {

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
                        _id: options.targetLayer._id
                    }
                ]
            },
            invert: options.invert ?? false,
            calculation: {
                _enum: "calculationType",
                _value: options.calculationType
            }
        }
    };

    if (typeof options.scale === 'number') {
        descriptor.with.scale = options.scale;
    }
    if (typeof options.offset === 'number') {
        descriptor.with.offset = options.offset;
    }

    return descriptor;
}

export async function imageCalculation(options: ImageCalculationOptions) {
    const [result] = await app.batchPlay([
        DocumentUtils._selectLayers([options.layer]),
        _imageCalculation(options)
    ]);

    if (result.message) {
        throw new Error(result.message);
    }
}