import { app } from 'photoshop';
import * as React from 'react'
import * as ReactDOM from 'react-dom';
import { Pages } from './pages';
import { Tabbar } from './tabbar';

export function renderApp() {
    try {

        const rootElement = document.getElementById('app');
        const scrimElement = document.getElementById('loadingScrim');

        ReactDOM.render(<>
            <Tabbar />
            <Pages />
        </>, rootElement, () => {
            scrimElement?.remove();
        });

    } catch (err) {
        console.error(err);
        app.showAlert(err.message);
    }
}