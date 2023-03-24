import { storage } from 'uxp';
import { createFolderToken } from '../../modules/storage/fs';
import { AbortError } from '../errors/abort-error';

export async function getFileForSaving(suggestedFileName: string, suggestedFolder?: string) {

    let initialLocation: string | undefined;

    if (suggestedFolder) {
        initialLocation = await createFolderToken(suggestedFolder);
    }

    const file = await storage.localFileSystem.getFileForSaving(suggestedFileName, {
        types: ['png', 'jpg'],
        initialLocation
    });

    // Dialog very likely 
    if (!file)
        throw new AbortError();

    // Convert type to File
    // The save functions from photoshop require a type File, but the objects we get from photoshop don't match the interface of `File`
    return file as unknown as File;
}