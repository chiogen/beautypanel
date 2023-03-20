import { app } from 'photoshop';
import { isAbortError } from './abort-error';

export async function handleException(err: Error) {

    if (isAbortError(err)) {
        console.log('Action canceled');
        return;
    }

    await app.showAlert(err.message);
}