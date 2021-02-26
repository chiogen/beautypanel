console.log('Loading Beautypanel...');

import { app } from 'photoshop';
import './styles/index.scss';
import { localizationLoaded } from './localization';

import './common/prototype-pollution/layer';
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

app.eventNotifier = (event, descriptor) => {
    console.log(event, JSON.stringify(descriptor, null, ' '));
}