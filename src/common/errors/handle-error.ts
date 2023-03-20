import { app } from 'photoshop';
import { isAbortError } from './abort-error';

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