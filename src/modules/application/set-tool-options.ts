import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { checkDescriptorError } from '../../common/errors/handle-error';

export async function setToolOptions(options: Object) {

    const [result] = await app.batchPlay([
        _setToolOptions(options)
    ], {});

    checkDescriptorError(result);

}

export function _setToolOptions(options: Object, toolId?: string): ActionDescriptor {
    return {
        _obj: 'set',
        _target: {
            _ref: toolId ?? app.currentTool.id
        },
        to: {
            ...options
        }
    };
}