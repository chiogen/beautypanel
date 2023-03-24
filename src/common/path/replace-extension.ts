import { join, parse } from 'path';

export function replaceExtension(input: string, newExt: string) {

    const { dir, name } = parse(input);

    if (newExt[0] !== '.')
        newExt = '.' + newExt;

    return join(dir, name + newExt);
}