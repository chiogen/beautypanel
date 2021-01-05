
declare module 'photoshop' {

    export type Bounds = {
        left: number
        top: number
        right: number
        bottom: number
    }

    export interface PhotoshopTool {
        id: string
    }

    export interface PhotoshopArtboard {

    }

    export interface PhotoshopAction {
        new (e: unknown): PhotoshopAction
        name: string
        index: number
        parent: unknown
        delete(): unknown
        duplicate(): unknown
        play(): unknown
    }
    export interface PhotoshopActionSet {
        new (e: unknown): PhotoshopActionSet
        name: string
        index: number
        parent: unknown
        actions: PhotoshopAction[]
        new (e: unknown): PhotoshopAction
        delete(): unknown
        duplicate(): unknown
        play(): unknown
    }

    export interface PhotoshopDocumentLayer {
        new (e: unknown, t: unknown): PhotoshopDocumentLayer
        name: string
        blendMode?: string
        readonly bounds: Bounds
        readonly boundsNoEffects: Bounds
        readonly kind: number
        readonly linkedLayers: PhotoshopDocumentLayer[]
        locked: boolean
        /** Percentage value ? */
        opacity: number
        readonly parent: any
        selected: boolean
        visible: boolean
    }

    export interface PhotoshopGroupLayer extends PhotoshopDocumentLayer {
        new (t: unknown, r: unknown): PhotoshopGroupLayer
        readonly children: Array<unknown>        
    }

    export interface PhotoshopDocument {
        new (e: unknown): PhotoshopDocument
        readonly activeLayers: PhotoshopDocumentLayer[]
        readonly layerTree: PhotoshopDocumentLayer[]
        readonly layers: PhotoshopDocumentLayer[]
        readonly artboards: PhotoshopArtboard[]
        readonly backgroundLayer: PhotoshopDocumentLayer
        readonly path: string
        readonly resolution: number
        readonly title: string
        readonly width: number
        readonly height: number
        close(e: unknown): Promise<void>
        closeWithoutSaving(): void
        createLayer(e: unknown): Promise<PhotoshopDocumentLayer>
        createLayerGroup(e: unknown): Promise<unknown>
        crop(e: unknown, t: unknown): Promise<unknown>
        duplicateLayers(e: unknown, t: unknown): Promise<unknown>
        flatten(): Promise<unknown>
        linkLayers(e: unknown): Promise<unknown>
        mergeVisibleLayers(): Promise<unknown>
        resizeCanvas(e: unknown, t: unknown, r: unknown): Promise<unknown>
        resizeImage(e: unknown, t: unknown, r: unknown, n: unknown): Promise<unknown>
        rotate(e: unknown): Promise<unknown>
        save(e: unknown, t: unknown): Promise<unknown>
    }

    export interface Photoshop {

        readonly Action: new (e: unknown) => PhotoshopAction
        readonly ActionSet: new (e: unknown) => PhotoshopActionSet
        readonly Document: new (e: unknown) => PhotoshopDocument
        readonly Layer: new (e: unknown, t: unknown) => PhotoshopDocumentLayer

        activeDocument: PhotoshopDocument
        readonly documents: PhotoshopDocument[]
        readonly actionTree: unknown
        readonly backgroundColor: object
        readonly foregroundColor: object
        readonly currentTool: PhotoshopTool

        batchPlay(e: unknown, t: unknown): unknown
        bringToFront(): unknown
        createDocument(e: unknown): PhotoshopDocument
        open(e: unknown): unknown
        showAlert(e: unknown): Promise<void>
    }

    export const app: Photoshop;

}