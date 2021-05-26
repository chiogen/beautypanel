
export interface AbortError extends Error {
    name: 'AbortError'
}

export function createAbortError() {
    const error = new Error('abort');
    error.name === 'AbortError';
}

export function throwAbortError() {
    throw createAbortError();
}

export function isAbortError(err: Error): err is AbortError {
    return err.name === 'AbortError';
}