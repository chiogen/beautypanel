import * as React from 'react'
import { showDialog } from './dialog';

export async function showMessageBox(message: string | JSX.Element) {
    let dialog: HTMLUxpDialogElement | undefined;
    const close = () => dialog?.close('dismiss');

    await showDialog(
        <sp-body>
            <p>
                {message}
            </p>
            <div role="row" className="actions">
                <sp-action-button onClick={close}> OK </sp-action-button>
            </div>
        </sp-body>,
        d => dialog = d
    );
}