import { parse } from 'path';
import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { Document } from 'photoshop/dom/Document';
import { BMPSaveOptions, GIFSaveOptions, JPEGSaveOptions, PNGSaveOptions } from 'photoshop/dom/Objects';
import { isAbortError } from '../../common/errors/abort-error';
import { checkDescriptorError } from '../../common/errors/handle-error';
import { getFileForSaving } from '../../common/fs/get-file-for-saving';
import { replaceExtension } from '../../common/path/replace-extension';
import { pixels } from '../../common/units';
import { DialogOptions } from '../../enums/dialog-options';
import { setPreferredSaveFormat } from '../../reducer/save';
import { store } from '../../store';

export function getLastScaleSize() {
    const storageValue = localStorage.getItem('lastScaleImageDescriptor');
    if (storageValue) {
        const descriptor = JSON.parse(storageValue);
        const width = descriptor.width?.value ?? -1;
        const height = descriptor.height?.value ?? -1;
        return Math.max(width, height);
    }
}

async function scaleImage(dialogOptions = DialogOptions.DontDisplay, size = 2048) {

    const key = 'lastScaleImageDescriptor';
    const storageValue = localStorage.getItem(key);

    const descriptor = storageValue ? JSON.parse(storageValue) : {
        // Set Default values
        scaleStyles: true,
        constrainProportions: true,
        interfaceIconFrameDimmed: {
            _enum: 'interpolationType',
            _value: 'automaticInterpolation'
        }
    };

    if (app.activeDocument!.width > app.activeDocument!.height) {
        descriptor.width = pixels(size);
        delete descriptor.height;
    } else {
        descriptor.height = pixels(size);
        delete descriptor.width;
    }

    const [result] = await app.batchPlay([
        {
            ...descriptor,
            _obj: 'imageSize',
            _options: {
                dialogOptions
            }
        }
    ], {});
    checkDescriptorError(result);

    localStorage.setItem(key, JSON.stringify({
        ...descriptor,
        ...result
    }));

}
async function unsharpMask(dialogOptions = DialogOptions.DontDisplay) {

    const key = 'lastUnsharpMaskDescriptor';
    const storageValue = localStorage.getItem(key);

    const descriptor: ActionDescriptor = storageValue ? JSON.parse(storageValue) : {};
    descriptor._obj = 'unsharpMask';
    descriptor._options = {
        dialogOptions
    };

    const [result] = await app.batchPlay([descriptor], {});
    checkDescriptorError(result);

    localStorage.setItem(key, JSON.stringify({
        ...descriptor,
        ...result
    }));

}

export async function saveScaledCopy() {

    if (!app.activeDocument) {
        return;
    }

    const document = app.activeDocument;
    const copy = await document.duplicate();

    if (!copy)
        throw new Error('Photoshop did not create a document copy');

    try {

        const state = store.getState();

        await scaleImage(DialogOptions.Display);
        await unsharpMask(DialogOptions.Display);

        const suggestedFolder = parse(document.path).dir;
        let suggestedFileName = document.name;
        suggestedFileName = replaceExtension(suggestedFileName, state.save.preferredSaveFormat);

        const file = await getFileForSaving(suggestedFileName, suggestedFolder);

        await save(copy, file, true);

    } catch (err) {

        if (isAbortError(err)) {
            console.log('Action canceled');
            return;
        }

        throw err;
    } finally {
        copy?.closeWithoutSaving();
    }

}

export async function saveUnscaledCopy() {

    if (!app.activeDocument) {
        return;
    }

    const document = app.activeDocument;
    const copy = await document.duplicate();

    if (!copy)
        throw new Error('Photoshop did not create a document copy');

    try {
        const state = store.getState();

        const suggestedFolder = parse(document.path).dir;
        let suggestedFileName = document.name;
        suggestedFileName = replaceExtension(suggestedFileName, state.save.preferredSaveFormat);

        const file = await getFileForSaving(suggestedFileName, suggestedFolder);

        await save(copy, file, true);

    } catch (err) {

        if (isAbortError(err)) {
            console.log('Action canceled');
            return;
        }

        throw err;
    } finally {
        copy?.closeWithoutSaving();
    }

}

export async function save(document: Document, file: File, saveAsCopy = false) {

    const { ext } = parse(file.name);

    if (!ext)
        throw new Error('Selected file has no extension.');

    switch (ext.toLowerCase()) {
        case '.jpg':
        case '.jpeg':
            await document.saveAs.jpg(file, {} as JPEGSaveOptions, saveAsCopy);
            break;
        case '.png':
            await document.saveAs.png(file, {} as PNGSaveOptions, saveAsCopy);
            break;
        case '.gif':
            await document.saveAs.gif(file, {} as GIFSaveOptions, saveAsCopy);
            break;
        case '.bmp':
            await document.saveAs.bmp(file, {} as BMPSaveOptions, saveAsCopy);
            break;
        case '.psd':
            await document.saveAs.psd(file, {} as never, saveAsCopy);
            break;
        case '.psb':
            await document.saveAs.psb(file, {} as never, saveAsCopy);
            break;
        default:
            throw new Error('Unsupported file type: ' + file.type);
    }

    store.dispatch(setPreferredSaveFormat(ext));

}