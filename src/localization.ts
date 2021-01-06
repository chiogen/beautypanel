import i18next from 'i18next'
import * as resources from './locales/index'

i18next.init({
    ns: ['common'],
    defaultNS: 'common',
    fallbackLng: 'en',
    lng: 'en',
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


// Apply localizations to static html elements
localizationLoaded.then(() => {
    document.body.querySelectorAll<HTMLElement>('[locale]').forEach(element => {
        const key = element.getAttribute('locale');
        element.innerHTML = i18next.t(key);
    });
})