import * as React from 'react'
import * as ReactDom from 'react-dom'
import i18next from "i18next";

export async function showMessageBox(message: string) {
    const title = i18next.t('appTitle');

    const dialog = document.createElement('dialog') as HTMLUxpDialogElement;
    document.body.appendChild(dialog);

    const close = () => dialog.close('ok');

    ReactDom.render(
        <sp-body>
            <p>
                {message}
            </p>
            <div role="row">
                <sp-action-button onClick={close}> OK </sp-action-button>
            </div>
        </sp-body>,
        dialog
    );
    
    await dialog.uxpShowModal({
        title
    });

    dialog.remove();

}