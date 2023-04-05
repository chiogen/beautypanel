console.log('Loading Beautypanel...');

import { app } from 'photoshop';
import { localizationLoaded } from './localization';

import './common/entrypoints';
import './common/polyfills/document-has-focus';
import './common/prototype-pollution/layer';

import { renderApp } from './interface';

localizationLoaded.then(async () => {
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