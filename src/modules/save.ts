import * as path from 'path'
import i18next from "i18next";
import { ActionDescriptor, app } from "photoshop";
import { createFolderToken } from "../common/app-utils";
import { pixels } from "../common/units";
import { DialogOptions } from "../enums/dialog-options";

export function getLastSavedFormat(): any | undefined {
    const value = localStorage.getItem('lastSavedFormat');
    if (value) {
        return JSON.parse(value);
    }
}
function setLastSavedFormat(format: object) {
    localStorage.setItem('lastSavedFormat', JSON.stringify(format));
}

export function getLastSavedPath() {
    return localStorage.getItem('lastSavedPath');
}
function setLastSavedPath(value: string) {
    localStorage.setItem('lastSavedPath', value);
}

export function getLastScaleWidth() {
    const storageValue = localStorage.getItem('lastScaleImageDescriptor');
    if (storageValue) {
        return JSON.parse(storageValue).width?._value;
    }
}

function isEmptyDescriptor(descriptor: object) {
    return Object.keys(descriptor).length === 0;
}

async function scaleImage(dialogOptions = DialogOptions.DontDisplay) {

    const key = 'lastScaleImageDescriptor';
    const storageValue = localStorage.getItem(key);

    const descriptor: any = storageValue ? JSON.parse(storageValue) : {
        // Set Default values
        width: pixels(2048),
        scaleStyles: true,
        constrainProportions: true,
        interfaceIconFrameDimmed: {
            _enum: "interpolationType",
            _value: "automaticInterpolation"
        }
    };

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
        throw new Error('abort');
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
        throw new Error('abort');
    }

    localStorage.setItem(key, JSON.stringify({
        ...descriptor,
        ...result
    }));

}
async function saveCopy(dialogOptions = DialogOptions.DontDisplay) {

    const descriptor: ActionDescriptor = {
        _obj: "save",
        _options: {
            dialogOptions
        },
        lowerCase: true
    }

    const format = getLastSavedFormat();
    if (format) {
        descriptor.as = format;
    }

    const lastSavedPath = getLastSavedPath();
    if (lastSavedPath) {
        const token = await createFolderToken(lastSavedPath);
        descriptor.in = {
            _path: token,
            _kind: "local"
        };
    }

    const [result] = await app.batchPlay([descriptor])

    if (result.message) {
        throw new Error(result.message);
    }
    if (isEmptyDescriptor(result)) {
        throw new Error('abort');
    }

    if (result.as) {
        setLastSavedFormat(result.as);
    }
    if (result.in) {
        const { dir } = path.parse(result.in._path)
        setLastSavedPath(dir);
    }

}

export async function saveScaledCopy() {

    if (!app.activeDocument) {
        return;
    }

    const copy = await app.activeDocument.duplicate();

    try {

        if (copy) {
            await scaleImage(DialogOptions.Display);
            await unsharpMask(DialogOptions.Display);
            await saveCopy(DialogOptions.Display);

            const message = i18next.t('savePage.messages.copySaveSuccess');
            app.showAlert(message);
        }

    } catch (err) {
        if (err.message === 'abort') {
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

    const copy = await app.activeDocument.duplicate();

    try {

        if (copy) {
            await saveCopy(DialogOptions.Display);

            const message = i18next.t('savePage.messages.copySaveSuccess');
            app.showAlert(message);
        }

    } catch (err) {
        if (err.message === 'abort') {
            app.showAlert('Abgebrochen');
            return;
        }
        throw err;
    } finally {
        copy?.closeWithoutSaving();
    }

}