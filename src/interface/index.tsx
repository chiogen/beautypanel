import { app } from 'photoshop';
import * as React from 'react'
import * as ReactDOM from 'react-dom';
import { Pages } from './pages';
import { Tabbar } from './tabbar';

function App() {
    if (!app.activeDocument) {
        return <div key="failstart">
            <h3 style={{ textAlign: 'center' }}>Waiting for image...</h3>
        </div>;
    }
    return (
        <div key="app">
            <Tabbar />
            <Pages />
        </div>
    );
}

export function renderApp() {
    try {
        const rootEl = document.getElementById('app');
        ReactDOM.render(App(), rootEl);
    } catch (err) {
        console.error(err);
        app.showAlert(err.message);
    }
}