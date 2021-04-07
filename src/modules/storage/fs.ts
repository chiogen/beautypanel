import { storage } from "uxp";

const cachedTokens = new Map<string, string>();

export async function createFileToken(nativePath: string) {
    let token = cachedTokens.get(nativePath);

    if (!token) {

        token = await storage.localFileSystem.createSessionToken({
            isFile: true,
            nativePath
        });

        cachedTokens.set(nativePath, token);

    }

    return token;
}

export async function createFolderToken(nativePath: string) {
    let token = cachedTokens.get(nativePath);

    if (!token) {

        token = await storage.localFileSystem.createSessionToken({
            isFolder: true,
            nativePath
        });

        cachedTokens.set(nativePath, token);

    }

    return token;
}

/** Use token trick to get a file entry. */
export async function createFileEntry(nativePath: string) {
    const token = await createFileToken(nativePath);
    return storage.localFileSystem.getEntryForSessionToken(token);
}

/** Use token trick to get a fodler entry. */
export async function createFolderEntry(nativePath: string) {
    const token = await createFolderToken(nativePath);
    return storage.localFileSystem.getEntryForSessionToken(token);
}