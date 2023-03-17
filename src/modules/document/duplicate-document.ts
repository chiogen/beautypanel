import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { Document } from 'photoshop/dom/Document';
import app from 'photoshop/dom/Photoshop';

export async function duplicateDocument(document: Document, name?: string): Promise<Document | null> {

    const descriptor: ActionDescriptor = {
        _obj: 'duplicate',
        _target: [
            {
                _ref: 'document',
                _enum: 'ordinal',
                _value: 'first'
            }
        ],
        documentID: document.id,
        '_isCommand': true
    };

    if (name) {
        descriptor.name = name;
    }

    const [result] = await app.batchPlay([descriptor], {});

    if (result.message) {
        throw new Error(result.message);
    }

    return app.activeDocument;
}