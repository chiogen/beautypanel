// Core
import './localization';

// User Interface
import * as ReactDOM from 'react-dom';
import { html } from 'htm/react';
import './styles/entry.scss';
import './interface/tabbar';

// Tools
import './tools/opacity';
import './tools/hardness';
import { Tools } from './interface/pages/tools';
import { tabbar } from './interface/tabbar';
import { localizationLoaded } from './localization';

localizationLoaded.then(() => {
    ReactDOM.render(html`
        <div key="tabbar">
            ${tabbar()}
        </div>
        <div id="pages" key="pages">
            ${Tools()}
            <div id="sharpen" className="page"></div>
            <div id="effects" className="page"></div>
        </div>
    `, document.getElementById('app'));
})