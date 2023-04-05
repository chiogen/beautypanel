import { makeStyles } from '@material-ui/styles';
import { app } from 'photoshop';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Pages } from './pages';
import { Tabbar } from './tabbar';
import { VersionInfo } from './version-info';
import { Provider } from 'react-redux';
import { store } from '../store';

const rootElement = document.getElementById('app');
const scrimElement = document.getElementById('loadingScrim');

makeStyles({
    root: {
        backgroundColor: '#333'
    }
});

export function renderApp() {
    try {

        ReactDOM.render(
            <Provider store={store}>
                <Tabbar />
                <Pages />
                <VersionInfo />
            </Provider>, rootElement, () => {
                scrimElement?.remove();
            });

    } catch (err) {
        console.error(err);
        app.showAlert(err.message);
    }
}