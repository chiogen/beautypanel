import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { checkDescriptorError } from '../../../common/errors/handle-error';
import { pixels } from '../../../common/units';
import { DialogOptions } from '../../../enums/dialog-options';

export interface MedianNoiseOptions {
    radius?: number
    dialogOptions?: DialogOptions
}

export function _filterMedianNoise(options: MedianNoiseOptions) {

    const descriptor: ActionDescriptor = {
        _obj: 'median',
        _options: {
            dialogOptions: options.dialogOptions ?? DialogOptions.DontDisplay
        }
    };

    if (typeof options.radius === 'number') {
        descriptor.radius = pixels(options.radius);
    }

    return descriptor;
}

export async function filterMedianNoise(options: MedianNoiseOptions) {

    const [result] = await app.batchPlay([
        _filterMedianNoise(options)
    ], {});

    checkDescriptorError(result);
}