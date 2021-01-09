// Core
import './localization';

// User Interface
import * as ReactDOM from 'react-dom';
import { html } from 'htm/react';
import './styles/entry.scss';
import { Tools } from './interface/pages/tools';
import { tabbar } from './interface/tabbar';
import { localizationLoaded } from './localization';
import { Sharpen } from './interface/pages/sharpen';

localizationLoaded.then(() => {
    ReactDOM.render(html`
        <div key="tabbar">
            ${tabbar()}
        </div>
        <div id="pages" key="pages">
            ${Tools()}
            ${Sharpen()}
            <div id="effects" className="page"></div>
        </div>
    `, document.getElementById('app'));
})