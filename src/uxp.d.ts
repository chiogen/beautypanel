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