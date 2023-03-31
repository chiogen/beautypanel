console.log('Loading Beautypanel...');

import { app } from 'photoshop';
import { localizationLoaded } from './localization';

import './common/polyfills/document-has-focus';
import './common/prototype-pollution/layer';
import './common/entrypoints';

import { renderApp } from './interface';
import { addDocumentLoadedCallback } from './common/active-document-observer';

localizationLoaded.then(async () => {
    addDocumentLoadedCallback(() => {
        renderApp();
    });
    renderApp();
}).catch(err => {
    app.showAlert(err.message);
});

try {
    app.eventNotifier = (event: object, descriptor: object) => {
        console.log('-------------------------------------------------------');
        console.log(event);
        console.log(descriptor);
        console.log(JSON.stringify(descriptor, null, ' '));
        console.log('-------------------------------------------------------');
    };
} catch (err) {
    console.log('eventNotifier not available.');
}