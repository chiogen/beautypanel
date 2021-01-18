// Core
import './localization';

// User Interface
import * as ReactDOM from 'react-dom';
import { html } from 'htm/react';
import './styles/entry.scss';
import { Tabbar } from './interface/tabbar';
import { localizationLoaded } from './localization';
import { Pages } from './interface/pages';
import * as photoshop from 'photoshop';

localizationLoaded.then(() => {
    ReactDOM.render(html`
        <${Tabbar} key="tabbar" />
        <${Pages} key="pages" />
    `, document.getElementById('app'));
})

photoshop.app.eventNotifier = (event, descriptor) => {
    console.log(event, JSON.stringify(descriptor, null, ' '));
}