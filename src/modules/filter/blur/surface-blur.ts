import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { Layer } from 'photoshop/dom/Layer';
import { checkDescriptorError } from '../../../common/errors/handle-error';
import { pixels } from '../../../common/units';


export function _surfaceBlur(layer: Layer, radius: number, threshold: number) {
    const descriptor: ActionDescriptor = {
        _obj: 'surfaceBlur',
        _target: {
            _ref: 'layer',
            _id: layer.id
        },
        radius: pixels(radius),
        threshold: threshold
    };

    return descriptor;
}

export async function surfaceBlur(layer: Layer, radius: number, threshold: number) {

    const [result] = await app.batchPlay([
        _surfaceBlur(layer, radius, threshold)
    ], {});
    
    checkDescriptorError(result);
}