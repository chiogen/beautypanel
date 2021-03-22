
export interface AbortError extends Error {
    name: 'AbortError'
}

export function throwAbortError() {
    const error = new Error('abort');
    error.name === 'AbortError';
    throw error;
}

export function isAbortError(err: Error): err is AbortError {
    return err.name === 'AbortError';
}