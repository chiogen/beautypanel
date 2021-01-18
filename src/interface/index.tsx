import * as React from 'react'
import * as ReactDOM from 'react-dom';
import { Pages } from './pages';
import { Tabbar } from './tabbar';

export function renderApp() {
    ReactDOM.render(
        <div key="root">
            <Tabbar />
            <Pages />
        </div>
    , document.getElementById('app'));
}