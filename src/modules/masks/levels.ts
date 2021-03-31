import { app } from "photoshop";
import { ActionDescriptor } from "photoshop";
import { DialogOptions } from "../../enums/dialog-options";

export interface LevelsAdjustmentsOptions {
    input?: number[]
    gamma?: number
}
export interface LevelsOptions {
    adjustment: LevelsAdjustmentsOptions
}
export interface AdjustmentLayerOptions {
    levels: LevelsOptions
    dialogOptions?: DialogOptions
}


export async function createAdjustmentLayer(options: AdjustmentLayerOptions) {
    const [result] = await app.batchPlay([
        _createAdjustmentLayer(options)
    ]);

    if (result.message) {
        throw new Error(result.message);
    }

    return result;
}

function _createAdjustmentLayer(options: AdjustmentLayerOptions): ActionDescriptor {
    const descriptor: ActionDescriptor = {
        _obj: "make",
        _target: [
            {
                _ref: "adjustmentLayer"
            }
        ],
        using: {
            _obj: "adjustmentLayer",
            type: _levels(options.levels)
        }
    };

    return descriptor;
}
function _levels(options: LevelsOptions) {
    const descriptor: ActionDescriptor = {
        _obj: "levels",
        presetKind: {
            _enum: "presetKindType",
            _value: "presetKindDefault"
        },
        adjustment: _levelsAdjustment(options.adjustment)
    };

    return descriptor;
}
function _levelsAdjustment(options: LevelsAdjustmentsOptions) {
    const descriptor: ActionDescriptor = {
        _obj: "levelsAdjustment",
        channel: {
            "_ref": "channel",
            "_enum": "channel",
            "_value": "composite"
        },
        input: [
            50,
            240
        ]
    };

    if (options.input) {
        descriptor.input = options.input;
    }
    if (typeof options.gamma === 'number') {
        descriptor.gamma = options.gamma;
    }

    return descriptor;
}