console.log('Loading Beautypanel...');

import { app } from 'photoshop';
import { localizationLoaded } from './localization';

import './common/polyfills/document-has-focus';
import './common/prototype-pollution/document';
import './common/prototype-pollution/layer';

import './common/entrypoints';

import { renderApp } from './interface';
import { addDocumentLoadedCallback } from './common/active-document-observer';

localizationLoaded.then(async () => {
    addDocumentLoadedCallback(() => {
        renderApp();
    })
    renderApp();
}).catch(err => {
    app.showAlert(err.message);
});

try {
    app.eventNotifier = (event, descriptor) => {
        console.log(event, JSON.stringify(descriptor, null, ' '));
    }
} catch (err) {
    console.log('eventNotifier not available.');
}