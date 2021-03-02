declare module 'uxp' {

    export interface File {

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
        localFileSystem: {
            isFileSystemProvider: boolean
            supportedDomains: Array<symbol>
            copyEntry(options: any): Promise<unknown>
            createEntry(options: any): Promise<unknown>
            createPersistentToken(e: unknown): Promise<unknown>
            createSessionToken(e: unknown): Promise<unknown>
            getDataFolder(): Promise<string>
            getEntries(options: { folder: string }): Promise<unknown[]>
            getEntry(options: { folder: string, filePath: string }): Promise<unknown>
            getEntryForPersostentToken(e: any): Promise<unknown>
            getEntryForSessionToken(e: unknown): Promise<unknown>
            getEntryMetadata(e: unknown): Promise<unknown>
            getFileForOpening(options: DialogOpenOptions): Promise<File | undefined>
            getFileForSaving(name: string, options?: any): Promise<File | undefined>
            getFolder(options: { initialDomain?: string, initialLocation?: string }): Promise<unknown>
            getNativePath(e: unknown): Promise<unknown>
            getPluginFolder(): Promise<Object>
            getTemporaryFolder(): Promise<Object>
            readFromFile(options: { entry: any, target: any, newName: any, overwrite: boolean }): Promise<unknown>
            writeToFile(options: { data: any, entry: any, format: any, append: boolean}): Promise<unknown>
        }
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