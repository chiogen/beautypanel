import { app } from 'photoshop';
import { Layer } from 'photoshop/dom/Layer';

Object.defineProperty(app.Layer.prototype, 'document', {
    get(this: Layer) {
        return app.documents.find(x => x.id === this._docId)!;
    }
});