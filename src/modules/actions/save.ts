import i18next from 'i18next';
import { parse } from 'path';
import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { Document } from 'photoshop/dom/Document';
import { JPEGSaveOptions, PNGSaveOptions } from 'photoshop/dom/Objects';
import { AbortError, isAbortError } from '../../common/errors/abort-error';
import { getFileForSaving } from '../../common/fs/get-file-for-saving';
import { addFilenameSuffix } from '../../common/path/add-filename-suffix';
import { pixels } from '../../common/units';
import { DialogOptions } from '../../enums/dialog-options';
import { setPreferredSaveFormat } from '../../reducer/save';
import { store } from '../../store';
import { showMessageDialog } from '../../ui/message-dialog';

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

    if (result._obj === 'error')
        throw new Error(result.message ?? '');

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

export async function saveScaledCopy() {

    if (!app.activeDocument) {
        return;
    }

    const document = app.activeDocument;
    const copy = await document.duplicate();

    if (!copy)
        throw new Error('Photoshop did not create a document copy');

    try {

        await scaleImage(DialogOptions.Display);
        await unsharpMask(DialogOptions.Display);

        const suggestedFolder = parse(document.path).dir;
        const suggestedFileName = addFilenameSuffix(document.name, ' scaled copy');

        const file = await getFileForSaving(suggestedFileName, suggestedFolder);
        await save(copy, file, true);

        const message = i18next.t('savePage.messages.copySaveSuccess');
        showMessageDialog(message);

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

        const suggestedFolder = parse(document.path).dir;
        const suggestedFileName = addFilenameSuffix(document.name, ' copy');
        const file = await getFileForSaving(suggestedFileName, suggestedFolder);
        await save(copy, file, true);

        const message = i18next.t('savePage.messages.copySaveSuccess');
        showMessageDialog(message);

    } finally {
        copy?.closeWithoutSaving();
    }

}

export async function save(document: Document, file: File, saveAsCopy = false) {

    const ext = file.name.toLowerCase().split('.').pop();
    if (!ext)
        throw new Error('Selected file has no extension.');

    if (ext === 'png') {
        await document.saveAs.png(file, {} as PNGSaveOptions, saveAsCopy);
    }
    else if (ext === 'jpg' || ext === 'jpeg') {
        await document.saveAs.jpg(file, {} as JPEGSaveOptions, saveAsCopy);
    }
    else {
        throw new Error('Unsupported file type: ' + file.type);
    }

    store.dispatch(setPreferredSaveFormat(ext));

}