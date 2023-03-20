
export class AbortError extends Error {
    name = 'AbortError' as const;
}

export function createAbortError() {
    return new AbortError();
}

export function throwAbortError() {
    throw new AbortError();
}

export function isAbortError(err: Error): err is AbortError {
    return err.name === 'AbortError';
}