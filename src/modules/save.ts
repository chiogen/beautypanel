import * as path from 'path'
import i18next from "i18next";
import { ActionDescriptor, app } from "photoshop";
import { pixels } from "../common/units";
import { DialogOptions } from "../enums/dialog-options";
import { storage } from 'uxp';
import { isAbortError, throwAbortError } from '../common/errors/abort-error';
import { createFolderToken } from './storage/fs';

export function getLastSavedFormat(): any | undefined {
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

    const descriptor: any = storageValue ? JSON.parse(storageValue) : {
        // Set Default values
        scaleStyles: true,
        constrainProportions: true,
        interfaceIconFrameDimmed: {
            _enum: "interpolationType",
            _value: "automaticInterpolation"
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
            _obj: "imageSize",
            _options: {
                dialogOptions
            }
        }        
    ]);

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
    const storageValue = localStorage.getItem(key)

    const descriptor: ActionDescriptor = storageValue ? JSON.parse(storageValue) : {};
    descriptor._obj = "unsharpMask"
    descriptor._options = {
        dialogOptions
    }

    const [result] = await app.batchPlay([descriptor]);

    if (result.message) {
        throw new Error(result.message);
    }

    if (isEmptyDescriptor(result)) {
        throwAbortError();
    }

    localStorage.setItem(key, JSON.stringify({
        ...descriptor,
        ...result
    }));

}
async function saveCopy(basePath: string, dialogOptions = DialogOptions.DontDisplay) {

    const basePathToken = await createFolderToken(basePath);

    const descriptor: ActionDescriptor = {
        _obj: "save",
        _options: {
            dialogOptions
        },
        in: {
            _path: basePathToken,
            _kind: "local"
        },
        lowerCase: true
    }

    const format = getLastSavedFormat();
    if (format) {
        descriptor.as = format;
    }

    const [result] = await app.batchPlay([descriptor])

    if (result.message) {
        throw new Error(result.message);
    }
    if (isEmptyDescriptor(result)) {
        throwAbortError();
    }

    if (result.as) {
        setLastSavedFormat(result.as);
    }

}

export async function saveScaledCopy() {

    if (!app.activeDocument) {
        return;
    }

    let folder = path.parse(app.activeDocument.path).dir;
    const copy = await app.activeDocument.duplicate();

    try {


        if (copy) {
            await scaleImage(DialogOptions.Display);
            await unsharpMask(DialogOptions.Display);

            if (folder) {
                await saveCopy(folder, DialogOptions.Display);
            } else {
                const file = await storage.localFileSystem.getFileForSaving({
                    types: ['png', 'jpg']
                });
                await copy.save(file);
            }

            const message = i18next.t('savePage.messages.copySaveSuccess');
            app.showAlert(message);
        }

    } catch (err) {

        const message = err.message || err;
        if (isAbortError(err)) {
            app.showAlert('Abgebrochen');
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

    let folder = path.parse(app.activeDocument.path).dir;
    const copy = await app.activeDocument.duplicate();

    try {

        if (copy) {

            if (folder) {
                await saveCopy(folder, DialogOptions.Display);
            } else {
                const file = await storage.localFileSystem.getFileForSaving({
                    types: ['png', 'jpg']
                });
                await copy.save(file);
            }

            const message = i18next.t('savePage.messages.copySaveSuccess');
            app.showAlert(message);
        }

    } catch (err) {
        if (isAbortError(err)) {
            app.showAlert('Abgebrochen');
            return;
        }
        throw err;
    } finally {
        copy?.closeWithoutSaving();
    }

}