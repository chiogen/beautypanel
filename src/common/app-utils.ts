import { ActionDescriptor, app } from "photoshop";

export namespace AppUtils {

    export async function selectTool(type: string, options: Object = {}): Promise<void> {

        const descriptor: ActionDescriptor = {
            _obj: 'select',
            _target: {
                _ref: type
            },
            to: {
                ...options
            }
        };

        await app.batchPlay([descriptor], {});
    }

}