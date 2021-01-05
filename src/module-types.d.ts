
declare module 'photoshop' {

    export interface PhotoshopDocumentLayer {
        name: string
    }

    export interface PhotoshopDocument {
        layers: PhotoshopDocumentLayer[]
    }

    export interface PhotoshopApp {
        activeDocument: PhotoshopDocument
    }

    export const app: PhotoshopApp;

}