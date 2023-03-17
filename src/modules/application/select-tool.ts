import { app } from "photoshop";
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { _setToolOptions } from './set-tool-options'

export async function selectTool(toolId: string, options?: Object): Promise<void> {

    const descriptors = new Array<ActionDescriptor>();

    descriptors.push(_selectTool(toolId));

    if (options) {
        descriptors.push(_setToolOptions(options, toolId));
    }

    await app.batchPlay(descriptors, {});
}

export function _selectTool(type: string): ActionDescriptor {
    return {
        _obj: 'select',
        _target: {
            _ref: type
        }
    };
}