
export class AbortError extends Error {
    name = 'AbortError' as const;
}

export function createAbortError() {
    return new AbortError();
}

export function throwAbortError() {
    throw new AbortError();
}

export function isAbortError(err: unknown): err is AbortError {
    return err instanceof Error && err.name === 'AbortError';
}