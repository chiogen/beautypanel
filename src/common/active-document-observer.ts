import { app } from 'photoshop';
import { Document } from 'photoshop/dom/Document';


export function addActiveDocumentChangedListener(callback: (document: Document) => any) {

    const interval = 500;

    let previousDocumentId: number | undefined;
    let handle: number | undefined;
    
    const tick = () => {
        const activeDocument = app.activeDocument;

        if (activeDocument && activeDocument.id !== previousDocumentId) {
            previousDocumentId = activeDocument.id;
            callback(activeDocument);
        }

        handle = setTimeout(tick, interval) as never as number;
    };

    handle = setTimeout(tick, interval) as never as number;

    return () => {
        if (typeof handle === 'number') {
            clearTimeout(handle);
        }
        previousDocumentId = undefined;
        handle = undefined;
    };
}