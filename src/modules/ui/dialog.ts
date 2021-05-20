import * as React from 'react'
import * as ReactDom from 'react-dom'
import i18next from "i18next";

export type DialogInitCallback = (dialog: HTMLUxpDialogElement) => void;

export async function showDialog<R = void>(template: JSX.Element, initCallback?: DialogInitCallback): Promise<R> {
    const title = i18next.t('appTitle');

    const dialog = document.createElement('dialog') as HTMLUxpDialogElement;
    document.body.appendChild(dialog);

    ReactDom.render(template, dialog);
    
    if (typeof initCallback === 'function') {
        initCallback(dialog);
    }

    const result = await dialog.uxpShowModal({
        title
    });

    dialog.remove();
    return result;
}