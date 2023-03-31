import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { AbortError, isAbortError } from './abort-error';

export async function handleException(err: unknown) {

    if (err === 'AbortError' || isAbortError(err)) {
        console.log('Action canceled');
        return;
    }

    const message = err instanceof Error
        ? err.message
        : err;

    if (typeof message === 'string' && message.length > 0)
        await app.showAlert(message);
    
}

export function checkDescriptorError(result: ActionDescriptor) {
    if (result._obj === 'error') {
        if (result.message) {
            throw new Error(result.message);
        } else {
            throw new AbortError();
        }
    }
}