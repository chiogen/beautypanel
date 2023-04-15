import { makeStyles } from '@material-ui/styles';
import { app } from 'photoshop';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import { App } from './app';

makeStyles({
    root: {
        backgroundColor: '#333'
    }
});

export function renderApp() {
    try {

        const rootElement = document.getElementById('app');
        const scrimElement = document.getElementById('loadingScrim');

        ReactDOM.render((
            <Provider store={store}>
                <App />
            </Provider>
        ), rootElement, () => {
            scrimElement?.remove();
        });

    } catch (err) {
        console.error(err);
        app.showAlert(err.message);
    }
}