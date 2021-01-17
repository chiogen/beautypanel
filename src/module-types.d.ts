
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
    export type PixelValue = {
        _unit: "pixelsUnit",
        _value: number
    };
    export type AngleValue = unknown;
    export type AnchorPosition = unknown;
    export type ResampleMethod = "nearestNeighbor" | "bilinear" | "bicubic" | "bicubicSmoother" | "bicubicSharper" | "bicubicAutomatic" | "preserveDetailsUpscale" | "deepUpscale";

    export abstract class File {

    }

    export class Reference {
        readonly _id: number
    }

    export abstract class Action {
        new(e: unknown): Action
        name: string
        index: number
        parent: unknown
        delete(): unknown
        duplicate(): Action
        play(): Promise<void>
    }
    export abstract class ActionSet {
        name: string
        index: number
        parent: unknown
        actions: Action[]
        new(e: unknown): Action
        delete(): void
        duplicate(): ActionSet
        play(): Promise<void>
    }

    export abstract class Layer extends Reference {
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
        duplicate(targetDocument?: Document, name?: string): Promise<Layer>
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

    export abstract class GroupLayer extends Layer {
        readonly children: Array<unknown>
    }

    export abstract class Document extends Reference {
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
        readonly Action: typeof Action
        readonly ActionSet: typeof ActionSet
        readonly Document: typeof Document
        readonly Layer: typeof Layer

        activeDocument: Document
        readonly documents: Document[]
        readonly actionTree: ActionSet[]
        readonly backgroundColor: object
        readonly foregroundColor: object
        readonly currentTool: Tool
        eventNotifier: (event: unknown, descriptor: unknown) => void

        batchPlay(commands: Array<ActionDescriptor>, options: any): Promise<Array<Descriptor & { message?: string}>>
        bringToFront(): void
        createDocument(options?: DocumentCreateOptions): Promise<Document | null>
        open(entry?: File): Promise<Document>
        showAlert(mesasge: string): Promise<void>
    }
    interface DocumentReference {
        _ref: 'document'
        _id: number
    }
    export interface DocumentCreateOptions {

    }
    export interface Descriptor {

    }
    export interface ActionDescriptor {
        /** This is the action key */
        _obj?: string
        _target?: ActionTargetReference | Array<ActionTargetReference>
        _options?: Object
        synchronousExecution?: boolean
        modalBehavior?: 'wait' | 'execute' | 'fail'
        historyStateInfo?: 'none' | { name: string, target: DocumentReference }
        [key: string]: any
    }
    export interface ActionTargetReference {
        _ref: string
        _id?: number
        _name?: string
        _enum?: string
        _value?: any
    }


    export const app: Photoshop;

    export const action: {
        batchPlay(descriptors: ActionDescriptor[], options: Object): Promise<Object[]>
    };

}

declare module 'uxp' {



    export const entryPoints: {
        _commands: Set<unknown>
        _panels: Set<unknown>
        _pluginInfo: {
            readonly id: string
            readonly manifest: Object
            _pluginInfo: {
                id: string
                name: string
                pluginPath: string
                pluginType: number
                privileged: boolean
                source: string
                uid: string
                version: string
            }
        }
    };

    export const host: {
        name: string
        uiLocale: string
        version: string
    };

    export const storage: {
        domains: {
            appLocalCache: symbol
            appLocalData: symbol
            appLocalLibrary: symbol
            appLocalShared: symbol
            appLocalTemporary: symbol
            appRoamingData: symbol
            appRoamingLibrary: symbol
            userDesktop: symbol
            userDocuments: symbol
            userMusic: symbol
            userPictures: symbol
            userVideos: symbol
        }
        formats: {
            binary: symbol
            utf8: symbol
        }
        modes: {
            readOnly: symbol
            readWrite: symbol
        }
        types: {
            file: symbol
            folder: symbol
        }
    };

}