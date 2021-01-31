import './styles/index.scss';
import { localizationLoaded } from './localization';
import { app } from 'photoshop';
import { renderApp } from './interface';
import { addDocumentLoadedCallback } from './common/active-document-observer';

localizationLoaded.then(() => {
    addDocumentLoadedCallback(() => {
        renderApp();
    });
        
    renderApp();
})

app.eventNotifier = (event, descriptor) => {
    console.log(event, JSON.stringify(descriptor, null, ' '));
}