import { app } from 'photoshop';
import * as React from 'react'
import * as ReactDOM from 'react-dom';
import { Pages } from './pages';
import { Tabbar } from './tabbar';

export function renderApp() {
    try {
        ReactDOM.render(<>
            <Tabbar />
            <Pages />        
        </>, document.getElementById('app'), () => {
            document.getElementById('loadingScrim')?.remove();
        });
    } catch (err) {
        console.error(err);
        app.showAlert(err.message);
    }
}