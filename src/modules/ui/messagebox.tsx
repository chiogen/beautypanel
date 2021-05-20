import * as React from 'react'
import { showDialog } from './dialog';

export async function showMessageBox(message: string) {
    await showDialog(
        <sp-body>
            <p>
                {message}
            </p>
            <div role="row" className="actions">
                <sp-action-button onClick={close}> OK </sp-action-button>
            </div>
        </sp-body>
    );
}