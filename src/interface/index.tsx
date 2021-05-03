import { makeStyles } from '@material-ui/styles';
import { app } from 'photoshop';
import * as React from 'react'
import * as ReactDOM from 'react-dom';
import { Pages } from './pages';
import { Tabbar } from './tabbar';

const rootElement = document.getElementById('app');
const scrimElement = document.getElementById('loadingScrim');

makeStyles({
    root: {
        backgroundColor: '#333'
    }
});

export function renderApp() {
    try {

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