export const sleep = (time = 1000) => new Promise<void>(
    fulfill => setTimeout(fulfill, time)
);