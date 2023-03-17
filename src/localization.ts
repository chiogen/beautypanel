import * as uxp from 'uxp';
import i18next from 'i18next';
import * as resources from './locales/index';

const supportedLanguages = ['en', 'de'];

function detectLanguage(): string {
    const uiLocale = uxp.host?.uiLocale.substring(0, 2).toLowerCase() ?? 'en';
    if (supportedLanguages.includes(uiLocale)) {
        return uiLocale;
    }
    return 'en';
}

i18next.init({
    ns: ['common'],
    defaultNS: 'common',
    fallbackLng: 'en',
    lng: detectLanguage(),
    lowerCaseLng: true,
    interpolation: {
        escapeValue: false
    }
});


// Load localization resources
export const localizationLoaded = new Promise<void>((fulfill) => {
    for (const language in resources) {
        const data = resources[language];
        if (!data) {
            continue;
        }
        i18next.addResourceBundle(language, 'common', data);
    }

    fulfill();
});