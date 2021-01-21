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

        const result = await app.batchPlay([descriptor], {});

        for (const item of result) {
            if (item.message)
                await app.showAlert(item.message);
        }
    }

    export async function setToolOptions(options: Object) {

        const descriptor: ActionDescriptor = {
            _obj: 'set',
            _target: {
                _ref: app.currentTool.id
            },
            to: {
                ...options
            }
        };

        const result = await app.batchPlay([descriptor], {});

        for (const item of result) {
            if (item.message)
                await app.showAlert(item.message);
        }

    }

}