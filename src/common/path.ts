
export interface ParsedPath {
    root: string
    dir: string
    base: string
    name: string
    ext: string
}

export function parse(path: string) {

    path = path.split('\\').join('/')

    const parts = path.split('/')

    const root = parts.shift() ?? '';
    const base = parts.pop() ?? '';
    const dir = root + parts.join('/');
    const { name, ext } = splitBase(base);

    return { root, dir, base, name, ext };
}
function splitBase(base: string): { name: string, ext: string } {
    const lastDotIndex = base.lastIndexOf('.');
    return {
        name: base.substring(0, lastDotIndex - 1),
        ext: base.substring(lastDotIndex)
    }
}