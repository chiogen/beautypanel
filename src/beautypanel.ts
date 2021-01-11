// Core
import './localization';

// User Interface
import * as ReactDOM from 'react-dom';
import { html } from 'htm/react';
import './styles/entry.scss';
import { Tabbar } from './interface/tabbar';
import { localizationLoaded } from './localization';
import { Pages } from './interface/pages';

localizationLoaded.then(() => {
    ReactDOM.render(html`
        <${Tabbar} key="tabbar" />
        <${Pages} key="pages" />
    `, document.getElementById('app'));
})