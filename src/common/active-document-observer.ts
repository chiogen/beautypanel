import { app, Document } from "photoshop";

export function addDocumentLoadedCallback(callback: (document: Document) => any) {

    let previousDocumentPath: string | null | undefined = app.activeDocument?.path;

    let handle: number | undefined = setInterval(() => {
        if (app.activeDocument && app.activeDocument.path !== previousDocumentPath) {
            previousDocumentPath = app.activeDocument.path;
            callback(app.activeDocument);
        }
    }, 500) as any;

    return () => {
        clearTimeout(handle);
        previousDocumentPath = undefined;
        handle = undefined;
    };
}