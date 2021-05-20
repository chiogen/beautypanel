import * as React from 'react'
import * as ReactDom from 'react-dom'
import i18next from "i18next";

export const enum ConfirmDialogChoiceSet {
    YesNo,
    OkAbort
}

export async function showConfirmDialog(message: string, choiceSet = ConfirmDialogChoiceSet.OkAbort) {
    const title = i18next.t('appTitle');

    const dialog = document.createElement('dialog') as HTMLUxpDialogElement;
    document.body.appendChild(dialog);

    ReactDom.render(
        <sp-body>
            <p>
                {message}
            </p>
            <div>
                {renderChoices(dialog, choiceSet)}
            </div>
        </sp-body>,
        dialog
    );
    
    const result = await dialog.uxpShowModal({
        title
    });

    dialog.remove();

    return result === 'ok';
}

function renderChoices(dialog: HTMLUxpDialogElement, choiceSet: ConfirmDialogChoiceSet) {
    switch(choiceSet) {
        case ConfirmDialogChoiceSet.YesNo:
            return renderYesNoChoices(dialog);
        default:
            return renderOkAbortChoices(dialog);
    }
}

function renderYesNoChoices(dialog: HTMLUxpDialogElement) {

    const _confirm = () => dialog.close('ok');
    const _decline = () => dialog.close('declined');

    return <>
        <sp-action-button onClick={_confirm}>{i18next.t('yes')}</sp-action-button>
        <sp-action-button onClick={_decline}>{i18next.t('no')}</sp-action-button>
    </>;
}
function renderOkAbortChoices(dialog: HTMLUxpDialogElement) {

    const _yes = () => dialog.close('ok');
    const _no = () => dialog.close('declined');

    return (
        <sp-action-button></sp-action-button>
    )

}