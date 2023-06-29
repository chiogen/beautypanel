console.log('Loading Beautypanel...');

import { app } from 'photoshop';
import { localizationLoaded } from './localization';

import './common/entrypoints';
import './common/polyfills/document-has-focus';
import './common/prototype-pollution/layer';

import { renderApp } from './interface';

localizationLoaded.then(renderApp).catch(err => {
    app.showAlert(err.message);
});

import './watchers/watch-copyright-layer';