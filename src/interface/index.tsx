import { app } from 'photoshop';
import * as React from 'react'
import * as ReactDOM from 'react-dom';
import { Pages } from './pages';
import { Tabbar } from './tabbar';

export function renderApp() {
    try {
        ReactDOM.render(
            <div key="root">
                <Tabbar />
                <Pages />
            </div>
        , document.getElementById('app'));
    } catch (err) {
        console.error(err);
        app.showAlert(err.message);
    }
}