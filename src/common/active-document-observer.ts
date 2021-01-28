import { app, Document } from "photoshop";

export function addDocumentLoadedCallback(callback: (document: Document) => any) {

    let previousDocumentPath: string | null | undefined = app.activeDocument?.path;

    let handle = setInterval(() => {
        if (app.activeDocument && app.activeDocument.path !== previousDocumentPath) {
            previousDocumentPath = app.activeDocument.path;
            callback(app.activeDocument);
        }
    }, 500);

    return () => {
        clearTimeout(handle);
        previousDocumentPath = undefined;
        handle = undefined;
    };
}