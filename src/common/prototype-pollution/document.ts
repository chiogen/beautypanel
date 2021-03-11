import { app, Document, ActionDescriptor } from "photoshop";

declare module 'photoshop' {
    export interface Document {
        duplicate(name?: string): Promise<Document | null>
    }
}

if (!app.Document.prototype.duplicate) {
    app.Document.prototype.duplicate = async function (this: Document, name?: string): Promise<Document | null> {

        const descriptor: ActionDescriptor = {
            _obj: "duplicate",
            _target: [
                {
                    _ref: "document",
                    _enum: "ordinal",
                    _value: "first"
                }
            ],
            documentID: this._id,
            "_isCommand": true
        }

        if (name) {
            descriptor.name = name;
        }

        const [result] = await app.batchPlay([descriptor]);

        if (result.message) {
            throw new Error(result.message);
        }

        return app.activeDocument;
    }
}