import { app } from 'photoshop';
import * as React from 'react'
import * as ReactDOM from 'react-dom';
import { Pages } from './pages';
import { Tabbar } from './tabbar';

export function renderApp() {
    try {

        const rootEl = document.getElementById('app');

        if (app.activeDocument) {
            ReactDOM.render(
                (<div key="app">
                    <Tabbar />
                    <Pages />
                </div>)
            , rootEl);
        } else {
            ReactDOM.render(
                (<div key="failstart">
                    <h3 style={{ textAlign: 'center' }}>Waiting for image...</h3>
                </div>)
                , rootEl
            );
        }
    } catch (err) {
        console.error(err);
        app.showAlert(err.message);
    }
}