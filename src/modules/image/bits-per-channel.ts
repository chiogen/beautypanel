import i18next from "i18next";
import { ActionDescriptor, app, Document } from "photoshop";
import { ConfirmDialogChoiceSet, showConfirmDialog } from "../ui/confirm";


export async function getBitsPerChannel(document: Document): Promise<number> {
    const descriptor: ActionDescriptor = {
        _obj: "get",
        _target: [
            {
                _property: "depth"
            },
            {
                _ref: "document",
                _id: document._id
            }
        ]
    };

    const [result] = await app.batchPlay([descriptor], {});
    return (result as any).depth as number;
}

export async function checkBitsPerChannel(document: Document) {

    const bitsPerChannel = await getBitsPerChannel(document);
    if (bitsPerChannel >= 16) {
        return;
    }

    const message = i18next.t('requestBitsPerChannelConvert');
    const convert = await showConfirmDialog(message, ConfirmDialogChoiceSet.YesNo);

    if (convert) {

        const descriptor: ActionDescriptor = {
            _obj: 'convertMode',
            _target: {
                _ref: 'document',
                _id: document._id
            },
            depth: 16,
            merge: false
        };

        await app.batchPlay([descriptor], {});

    }

}