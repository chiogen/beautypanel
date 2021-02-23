console.log('Loading Beautypanel...');

import './styles/index.scss';
import { localizationLoaded } from './localization';

import { app } from 'photoshop';

app.eventNotifier = (event, descriptor) => {
    console.log(event, JSON.stringify(descriptor, null, ' '));
}

localizationLoaded.then(async () => {

    await import('./common/prototype-pollution/layer')
    const { renderApp } = await import('./interface/index')

    renderApp();
})