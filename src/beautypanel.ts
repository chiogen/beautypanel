import './styles/entry.scss';
import { localizationLoaded } from './localization';
import { app } from 'photoshop';
import { renderApp } from './interface';

localizationLoaded.then((renderApp))

app.eventNotifier = (event, descriptor) => {
    console.log(event, JSON.stringify(descriptor, null, ' '));
}