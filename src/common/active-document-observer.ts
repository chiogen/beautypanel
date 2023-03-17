import { app } from "photoshop";
import { Document } from 'photoshop/dom/Document';


export function addDocumentLoadedCallback(callback: (document: Document) => any) {

    const interval = 500;

    let previousDocumentPath: string | null | undefined = app.activeDocument?.path;
    let handle: number | undefined;
    
    const tick = () => {
        const activeDocument = app.activeDocument;

        if (activeDocument && activeDocument.path !== previousDocumentPath) {
            previousDocumentPath = activeDocument.path;
            callback(activeDocument);
        }

        handle = setTimeout(tick, interval) as any as number;
    }

    handle = setTimeout(tick, interval) as any as number;

    return () => {
        if (typeof handle === 'number') {
            clearTimeout(handle);
        }
        previousDocumentPath = undefined;
        handle = undefined;
    };
}