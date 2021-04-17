import { ActionDescriptor, app } from "photoshop";

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