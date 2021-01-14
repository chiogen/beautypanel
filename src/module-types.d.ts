
declare namespace JSX {
    interface IntrinsicElements {
        'sp-action-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
    }
}
declare module 'photoshop' {

    export type Bounds = {
        left: number
        top: number
        right: number
        bottom: number
    }

    export interface Tool {
        id: string
    }

    export type Artboard = any
    export type LayerTypes = Layer;
    export type PercentValue = { 
        _unit: "percentUnit", 
        /** value between 0 and 100 */
        _value: number
    };
    export type PixelValue = unknown;
    export type AngleValue = unknown;
    export type AnchorPosition = unknown;
    export type ResampleMethod = "nearestNeighbor" | "bilinear" | "bicubic" | "bicubicSmoother" | "bicubicSharper" | "bicubicAutomatic" | "preserveDetailsUpscale" | "deepUpscale";

    export interface File {

    }

    export interface Reference {
        readonly _id: string
    }

    export interface Action {
        new(e: unknown): Action
        name: string
        index: number
        parent: unknown
        delete(): unknown
        duplicate(): Action
        play(): Promise<void>
    }
    export interface ActionSet {
        new(e: unknown): ActionSet
        name: string
        index: number
        parent: unknown
        actions: Action[]
        new(e: unknown): Action
        delete(): void
        duplicate(): ActionSet
        play(): Promise<void>
    }

    export interface Layer extends Reference {
        new(e: unknown, t: unknown): Layer
        name: string
        readonly bounds: Bounds
        readonly boundsNoEffects: Bounds
        readonly kind: number
        readonly linkedLayers: Layer[]
        blendMode?: string
        locked: boolean
        /** Percentage value ? */
        opacity: number
        selected: boolean
        visible: boolean
        delete(): void
        duplicate(targetDocument?: Document, name?: string): Promise<void>
        flip(axis:  "horizontal" | "vertical" | "both"): Promise<void>
        link(targetLayer: Layer): Layer[]
        moveAbove(target: LayerTypes): void
        moveBelow(target: LayerTypes): void
        nudge(horizontal: number | PercentValue | PixelValue, vertical: number | PercentValue | PixelValue): Promise<void>
        rotate(angle: number | AngleValue): Promise<void>
        scale(width: number | PercentValue, height: number | PercentValue, options?: { interpolation?: unknown }): Promise<void>
        skew(angleH: number | AngleValue, angleV: number | AngleValue, options?: { interpolation?: unknown }): Promise<void>
        unlink(): Promise<void>
    }

    export interface GroupLayer extends Layer {
        new(t: unknown, r: unknown): GroupLayer
        readonly children: Array<unknown>
    }

    export interface Document extends Reference {
        readonly _id: string
        new(e: unknown): Document
        readonly activeLayers: Layer[]
        readonly layerTree: Layer[]
        readonly layers: Layer[]
        readonly artboards: Artboard[]
        readonly backgroundLayer: Layer | null
        readonly path: string
        readonly resolution: number
        readonly title: string
        readonly width: number
        readonly height: number
        close(saveDialogOptions?: SaveDialogOptions): Promise<void>
        closeWithoutSaving(): void
        createLayer(options?: LayerCreateOptions): Promise<Layer | null>
        createLayerGroup(options?: GroupLayerCreateOptions): Promise<GroupLayer | null>
        /**
         * Crops the document to given bounds
         */
        crop(bounds: unknown, angle: number): Promise<void>
        /**
         * Duplicates given layer(s), creating all copies above the top most one in layer stack, and returns the newly created layers.
         */
        duplicateLayers(layers: Layer[], targetDocument?: Document): Promise<Layer[]>
        /**
         * Flatten all layers in the document
         */
        flatten(): Promise<void>
        /**
         * Create a layer group from existing layers.
         */
        groupLayers(layers: Layer[]): Promise<GroupLayer | null>
        linkLayers(layers: Layer[]): Promise<Layer[]>
        mergeVisibleLayers(): Promise<void>
        resizeCanvas(width: number, height: number, anchor?: AnchorPosition): Promise<void>
        resizeImage(width: number, height: number, resolution?: number, resampleMethod?: ResampleMethod): Promise<void>
        rotate(angles: number): Promise<void>
        save(entry?: File, saveOptions?: SaveOptions): Promise<void>
    }
    export interface SaveDialogOptions {
        
    }
    export interface SaveOptions {
        embedColorProfile: boolean
    }
    export interface LayerCreateOptions {
        name: string
        opacity: number
        mode: string
    }
    export interface GroupLayerCreateOptions {
        name: string
        fromLayers: Layer[]
        opacity: number
        mode: string
    }

    export interface Photoshop {
        readonly Action: new (e: unknown) => Action
        readonly ActionSet: new (e: unknown) => ActionSet
        readonly Document: new (e: unknown) => Document
        readonly Layer: new (e: unknown, t: unknown) => Layer

        activeDocument: Document
        readonly documents: Document[]
        readonly actionTree: ActionSet[]
        readonly backgroundColor: object
        readonly foregroundColor: object
        readonly currentTool: Tool
        eventNotifier: (event: unknown, descriptor: unknown) => void

        batchPlay(commands: any, options: any): Promise<Descriptor[]>
        bringToFront(): void
        createDocument(options?: DocumentCreateOptions): Promise<Document | null>
        open(entry?: File): Promise<Document>
        showAlert(mesasge: string): Promise<void>
    }
    export interface DocumentCreateOptions {

    }
    export interface Descriptor {

    }
    export interface ActionDescriptor {

    }


    export const app: Photoshop;

    export const action: {
        batchPlay(descriptors: ActionDescriptor[], options: Object): Promise<Object[]>
    };

}