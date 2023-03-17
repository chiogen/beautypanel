import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { percent, pixels } from '../../../common/units';
import { DialogOptions } from '../../../enums/dialog-options';

export interface UnsharpMaskOptions {
    radius?: number
    amount?: number
    threshold?: number
    dialogOptions?: DialogOptions
}

export function _filterUnsharpMask(options: UnsharpMaskOptions) {
    const descriptor: ActionDescriptor = {
        _obj: 'unsharpMask',
        _options: {
            dialogOptions: options.dialogOptions ?? DialogOptions.DontDisplay
        }
    };

    if (typeof options.amount === 'number') {
        descriptor.amount = percent(options.amount);
    }
    if (typeof options.radius === 'number') {
        descriptor.radius = pixels(options.radius);
    }
    if (typeof options.threshold === 'number') {
        descriptor.threshold = options.threshold;
    }

    return descriptor;
}
export async function filterUnsharpMask(options: UnsharpMaskOptions) {
    
    const descriptor: ActionDescriptor = _filterUnsharpMask(options);
    const [result] = await app.batchPlay([descriptor], {});

    if (result.message) {
        throw new Error(result.message);
    }

    return result;
}