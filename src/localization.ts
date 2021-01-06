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

for (const language in resources) {

    const data = resources[language];
    if (!data) {
        continue;
    }

    i18next.addResourceBundle(language, 'common', data);
}

export const localizationLoaded = Promise.resolve();

localizationLoaded.then(() => {

    const elements = document.body.querySelectorAll<HTMLElement>('[locale]');

    for (const el of elements) {
        const key = el.getAttribute('locale');
        el.innerHTML = i18next.t(key);
    }

})