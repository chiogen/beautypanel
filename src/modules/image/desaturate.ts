import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { Layer } from 'photoshop/dom/Layer';
import { checkDescriptorError } from '../../common/errors/handle-error';

export function _desaturate(layer: Layer): ActionDescriptor {
    return {
        _obj: 'desaturate',
        _target: {
            _ref: 'layer',
            _id: layer.id
        }
    };
}
export async function imageDesaturation(layer: Layer) {
    const [ result ] = await app.batchPlay([
        _desaturate(layer)
    ], {});

    checkDescriptorError(result);
}