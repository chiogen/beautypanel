import { join, parse } from 'path';

export function addFilenameSuffix(input: string, suffix: string) {
    const { dir, name, ext } = parse(input);
    return join(dir, name + suffix + ext);
}