import { ActionDescriptor, app } from "photoshop";

export namespace AppUtils {

    export async function selectBrush(targetBrush: string, options: Object = {}): Promise<void> {

        const descriptor: ActionDescriptor = {
            _obj: 'select',
            _target: {
                _ref: targetBrush
            },
            to: {
                ...options
            }
        };

        await app.batchPlay([descriptor], {});
    }

}