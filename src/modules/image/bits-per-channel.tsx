import i18next from 'i18next';
import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { Document } from 'photoshop/dom/Document';
import * as React from 'react';
import { ConfirmDialogChoiceSet, showConfirmDialog } from '../ui/confirm';
import { showMessageBox } from '../ui/messagebox';

export async function getBitsPerChannel(document: Document): Promise<number> {
    const descriptor: ActionDescriptor = {
        _obj: 'get',
        _target: [
            {
                _property: 'depth'
            },
            {
                _ref: 'document',
                _id: document.id
            }
        ]
    };

    const [result] = await app.batchPlay([descriptor], {});
    return result.depth as number;
}

export async function checkBitsPerChannel(document: Document) {
    try {

        const bitsPerChannel = await getBitsPerChannel(document);
        if (bitsPerChannel >= 16) {
            return;
        }

        const message = i18next.t('confirmColorDepthConvert');
        const convertConfirmed = await showConfirmDialog(message, ConfirmDialogChoiceSet.YesNo);

        if (convertConfirmed) {
            await setBitsPerChannel(16);
        }

    } catch (err) {
        const { header, message } = i18next.t('colorDepthConvertFailed', {
            returnObjects: true,
            code: err.message
        }) as {
            header: string
            message: string
        };
        showMessageBox(
            <>
                <div>
                    <b>{header}</b>
                </div>
                <div>
                    {message}
                </div>
            </>
        );
    }
}

export function _setBitsPerChannel(bits: number): ActionDescriptor {
    const descriptor: ActionDescriptor = {
        _obj: 'convertMode',
        depth: bits,
        merge: false
    };

    return descriptor;
}
export async function setBitsPerChannel(bits: number): Promise<ActionDescriptor> {
    const descriptor = _setBitsPerChannel(bits);

    const [res] = await app.batchPlay([
        descriptor
    ], {});

    if (res.message) {
        throw new Error(res.message);
    }

    return res;
}