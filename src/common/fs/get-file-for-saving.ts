import { storage } from 'uxp';
import { createFolderToken } from '../../modules/storage/fs';
import { AbortError } from '../errors/abort-error';
import { parse } from 'path';

const SUPPORTED_FILE_TYPES = ['png', 'jpg', 'bmp'];

export async function getFileForSaving(suggestedFileName: string, suggestedFolder?: string) {

    let initialLocation: string | undefined;

    if (suggestedFolder) {
        initialLocation = await createFolderToken(suggestedFolder);
    }

    let extension = parse(suggestedFileName).ext.toLowerCase();
    if (extension.startsWith('.'))
        extension = extension.substring(1);

    const types = [
        extension,
        ...SUPPORTED_FILE_TYPES.filter(x => x !== extension)
    ];

    const file = await storage.localFileSystem.getFileForSaving(suggestedFileName, {
        types,
        initialLocation
    });

    // User probably clicked on 'abort'.
    if (!file)
        throw new AbortError();

    // Convert type to File
    // The save functions from photoshop require a type File, but the objects we get from photoshop don't match the interface of `File`
    return file as unknown as File;
}