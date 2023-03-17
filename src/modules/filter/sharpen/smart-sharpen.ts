import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { percent, pixels } from '../../../common/units';
import { DialogOptions } from '../../../enums/dialog-options';

interface AdaptCorrectTonesOptions {
    amount: number
    width: number
    radius: number
}

export interface FilterSmartSharpenOptions {
    amount?: number
    radius?: number
    noiseReduction?: number
    blur?: 'lensBlur' | 'gaussianBlur' | 'motionBlur'
    shadowMode?: AdaptCorrectTonesOptions
    highlightMode?: AdaptCorrectTonesOptions
    dialogOptions?: DialogOptions
}

function _adaptCorrectTones(options: AdaptCorrectTonesOptions) {
    return {
        _obj: 'adaptCorrectTones',
        amount: percent(options.amount),
        width: percent(options.width),
        radius: options.radius
    };
}

export function _filterSmartSharpen(options: FilterSmartSharpenOptions) {

    const { amount, radius, noiseReduction, blur, shadowMode, highlightMode, dialogOptions } = options;

    const descriptor: ActionDescriptor = {
        _obj: 'smartSharpen',
        presetKind: {
            _enum: 'presetKindType',
            _value: 'presetKindCustom'
        },
        useLegacy: false,
        _options: {
            dialogOptions: dialogOptions ?? DialogOptions.DontDisplay
        }
    };

    // Add main options
    if (typeof amount === 'number') {
        descriptor.amount = percent(amount);
    }
    if (typeof radius === 'number') {
        descriptor.radius = pixels(radius);
    }
    if (typeof noiseReduction === 'number') {
        descriptor.noiseReduction = percent(noiseReduction);
    }
    if (typeof blur === 'string') {
        descriptor.blur = {
            _enum: 'blurType',
            _value: 'lensBlur'
        };
    }

    if (shadowMode) {
        descriptor.shadowMode = _adaptCorrectTones(shadowMode);
    }
    if (highlightMode) {
        descriptor.highlightMode = _adaptCorrectTones(highlightMode);
    }

    return descriptor;
}

export async function filterSmartSharpen(options: FilterSmartSharpenOptions): Promise<ActionDescriptor> {

    const [result] = await app.batchPlay([
        _filterSmartSharpen(options)
    ], {});

    if (result.message) {
        throw new Error(result.message);
    }

    return result;
}