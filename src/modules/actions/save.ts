import i18next from 'i18next';
import * as path from 'path';
import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { Document } from 'photoshop/dom/Document';
import { storage } from 'uxp';
import { AbortError, isAbortError, throwAbortError } from '../../common/errors/abort-error';
import { pixels } from '../../common/units';
import { DialogOptions } from '../../enums/dialog-options';
import { createFolderToken } from '../storage/fs';

export function getLastSavedFormat(): ActionDescriptor | undefined {
    const value = localStorage.getItem('lastSavedFormat');
    if (value) {
        return JSON.parse(value);
    }
}
function setLastSavedFormat(format: object) {
    localStorage.setItem('lastSavedFormat', JSON.stringify(format));
}

export function getLastScaleSize() {
    const storageValue = localStorage.getItem('lastScaleImageDescriptor');
    if (storageValue) {
        const descriptor = JSON.parse(storageValue);
        const width = descriptor.width?.value ?? -1;
        const height = descriptor.height?.value ?? -1;
        return Math.max(width, height);
    }
}

function isEmptyDescriptor(descriptor: object) {
    return Object.keys(descriptor).length === 0;
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

    if (result.message) {
        throw new Error(result.message);
    }

    if (isEmptyDescriptor(result)) {
        throwAbortError();
    }

    console.log(result);
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

    if (result.message) {
        throw new Error(result.message);
    }

    if (isEmptyDescriptor(result)) {
        throw new AbortError();
    }

    localStorage.setItem(key, JSON.stringify({
        ...descriptor,
        ...result
    }));

}
async function saveCopy(basePath: string, dialogOptions = DialogOptions.DontDisplay) {

    const basePathToken = await createFolderToken(basePath);

    const descriptor: ActionDescriptor = {
        _obj: 'save',
        _options: {
            dialogOptions
        },
        in: {
            _path: basePathToken,
            _kind: 'local'
        },
        lowerCase: true
    };

    const format = getLastSavedFormat();
    if (format) {
        descriptor.as = format;
    }

    const [result] = await app.batchPlay([descriptor], {});

    if (result.message) {
        throw new Error(result.message);
    }
    if (isEmptyDescriptor(result)) {
        throw new AbortError();
    }

    if (result.as) {
        setLastSavedFormat(result.as);
    }

}

export async function saveScaledCopy() {

    if (!app.activeDocument) {
        return;
    }

    const document = app.activeDocument;
    const folder = path.parse(document.path).dir;
    const copy = await document.duplicate();

    try {

        if (copy) {
            await scaleImage(DialogOptions.Display);
            await unsharpMask(DialogOptions.Display);

            if (folder) {
                await saveCopy(folder, DialogOptions.Display);
            } else {
                const file = await storage.localFileSystem.getFileForSaving(document.name, {
                    types: ['png', 'jpg']
                });

                if (!file)
                    throw new AbortError();

                await save(copy, file);
            }

            const message = i18next.t('savePage.messages.copySaveSuccess');
            app.showAlert(message);
        }

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
    const folder = path.parse(document.path).dir;
    const copy = await document.duplicate();

    if (!copy)
        throw new Error('Photoshop did not create a document copy');

    try {

        if (folder) {

            await saveCopy(folder, DialogOptions.Display);

        } else {

            const file = await storage.localFileSystem.getFileForSaving(document.name, {
                types: ['png', 'jpg']
            });

            if (!file)
                throw new AbortError();

            await save(copy, file);

        }

        const message = i18next.t('savePage.messages.copySaveSuccess');
        app.showAlert(message);

    } finally {
        copy?.closeWithoutSaving();
    }

}

export async function save(document: Document, file: File, saveAsCopy = false) {

    const ext = file.name.toLowerCase().split('.').pop();
    if (!ext)
        throw new Error('Selected file has no extension.');

    if (ext === 'png') {
        await document.saveAs.jpg(file, undefined, saveAsCopy);
    }
    else if (ext === 'jpg' || ext === 'jpeg') {
        await document.saveAs.png(file, undefined, saveAsCopy);
    }
    else {
        throw new Error('Unsupported file type: ' + file.type);
    }

}