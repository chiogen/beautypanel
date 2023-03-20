declare module 'uxp' {

    export interface CreateEntryOptions {
        name: string
        parent: string
        mode?: string
        readOnly: boolean
    }

    export interface DialogOpenOptions {
        openFile?: boolean
        openDirectory?: boolean
        defaultPath: string
        multipleSelections?: boolean
        title?: string
        buttonLabel?: string
        /** Default value: ["*"] */
        filters?: string[]
        showHiddenFiles?: boolean
        initialLocation?: string
    }
    export interface DialogSaveOptions {
        defaultPath: string
        title?: string
        buttonLabel?: string
        filters: string[]
        showHiddenFiles?: boolean
        suggestedName?: string
        initialLocation?: string
    }

    export const entrypoints: {
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
        setup(config: {
            commands?: Record<string, any>
            panels?: Record<string, unknown>
        }): unknown
    };

    export const host: {
        name: string
        uiLocale: string
        version: string
    };

    export namespace storage {

        export const domains: {
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
        };

        export const formats: {
            binary: symbol
            utf8: symbol
        };
        export const modes: {
            readOnly: symbol
            readWrite: symbol
        };
        export const types: {
            file: symbol
            folder: symbol
        };


        export interface EntryMetadata {

        }
        export interface ReadFileOptions {
            /**
             * @default `formats.utf8`
             */
            format?: typeof formats.utf8 | typeof formats.binary
        }
        export interface WriteFileOptions {
            /**
             * @default `formats.utf8`
             */
            format?: typeof formats.utf8 | typeof formats.binary
            /**
             * if `true`, the data is writen to the end of the file
             * @default false
             */
            append?: boolean
        }

        /** https://www.adobe.io/photoshop/uxp/uxp/reference-js/Modules/uxp/Persistent%20File%20Storage/Entry/ */
        export abstract class Entry {
            readonly id: Object;
            readonly isEntry: boolean;
            readonly isFile: boolean;
            readonly isFolder: boolean;
            readonly name: string;
            readonly nativePath: string;
            copyTo(folder: Folder, options?: { overwrite?: boolean }): Promise<unknown>;
            moveTo(folder: Folder, options?: { overwrite?: boolean, newName: string }): Promise<unknown>;
            delete(): Promise<void>;
            getMetadata(): Promise<EntryMetadata>;
        }
        export abstract class File extends Entry {
            id: Object;
            isEntry: boolean;
            isFile: boolean;
            isFolder: boolean;
            name: string;
            nativePath: string;
            mode: typeof modes.readOnly | typeof modes.readWrite;
            read(options?: ReadFileOptions): Promise<string | ArrayBuffer>;
            write(data: string | ArrayBuffer, options?: WriteFileOptions): Promise<void>;
        }

        export abstract class Folder extends Entry {
            id: Object;
            isEntry: boolean;
            isFile: boolean;
            isFolder: boolean;
            name: string;
            nativePath: string;
        }

        /** https://www.adobe.io/photoshop/uxp/uxp/reference-js/Modules/uxp/Persistent%20File%20Storage/FileSystemProvider/ */
        interface LocalFileSystemProvider {
            isFileSystemProvider: boolean;
            supportedDomains: Array<symbol>




            getTemporaryFolder(): Promise<Folder>;

            createSessionToken(entry: Partial<Entry>): Promise<string>
            getEntryForSessionToken(token: string): Promise<Entry>
            createPersistentToken(entry: Partial<Entry>): Promise<string>
            getEntryForPersistentToken(topken: string): Promise<Entry>
            
            getFileForOpening(options: DialogOpenOptions): Promise<File | undefined>
            getFileForOpening(options: {
                initialDomain?: symbol
                types?: Array<string>
                intialLocation: File | Folder
                allowMultiple?: boolean
            }): Promise<File | Array<File>>;

            getFileForSaving(name: string, options?: {
                /** array of valid file types that the user can choose to assign to a file. (png|jpeg|...) */
                types: string[]
            }): Promise<File | undefined>

            getFolder(options?: { initialDomain?: string, initialLocation?: string }): Promise<Folder>
            getFolder(options?: {
                initialDomain?: symbol
            }): Promise<Folder | null>;

        }

        export const localFileSystem: LocalFileSystemProvider;
    }

}