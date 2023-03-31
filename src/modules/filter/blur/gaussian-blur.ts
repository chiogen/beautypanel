import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { checkDescriptorError } from '../../../common/errors/handle-error';
import { pixels } from '../../../common/units';
import { DialogOptions } from '../../../enums/dialog-options';

export function _filterGaussianBlur(radius: number, dialogOptions?: DialogOptions): ActionDescriptor {
    const descriptor: ActionDescriptor = {
        _obj: 'gaussianBlur',
        _options: {
            dialogOptions: dialogOptions ?? DialogOptions.DontDisplay
        }
    };

    if (typeof radius === 'number') {
        descriptor.radius = pixels(radius);
    }

    return descriptor;
}
export async function filterGaussianBlur(radius: number, dialogOptions?: DialogOptions) {

    const [result] = await app.batchPlay([
        _filterGaussianBlur(radius, dialogOptions)
    ], {});

    checkDescriptorError(result);
    return result;
}