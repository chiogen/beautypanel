declare class LanguageUtil {
    constructor (options: { 
        supportedLngs: string[]
    })
    formatLanguageCode(code: string[]): string
    getBestMatchFromCodes(codes: string[]): string
    getFallbackCodes(fallbacks: string[], code: string): string[]
    getLanguagePartFromCode(code: string): unknown
    getScriptPartFromCode(code: string): unknown
    isSupportedCode(code: String): boolean
    isWhitelisted(code: string): boolean
    toResolveHierarchy(code: string, fallbackCode: string): unknown
}

interface Window {
    LanguageUtil: LanguageUtil
}