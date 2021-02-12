import { ActionDescriptor, app } from "photoshop";

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

export async function setToolOptions(options: Object) {

    const [result] = await app.batchPlay([
        _setToolOptions(options)
    ], {});

    if (result.message)
        await app.showAlert(result.message);

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
