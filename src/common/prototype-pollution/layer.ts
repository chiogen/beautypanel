import { app, Layer, Document } from 'photoshop'

declare module 'photoshop' {
    export interface Layer {
        readonly document: Document
    }
}

Object.defineProperty(app.Layer.prototype, 'document', {
    get(this: Layer) {
        return app.documents.find(x => x._id === this._docId)!
    }
});