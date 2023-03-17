import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { Layer } from 'photoshop/dom/Layer';

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

    if (result.message) {
        throw new Error(result.message);
    }
}