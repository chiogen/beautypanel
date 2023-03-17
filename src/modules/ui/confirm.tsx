import * as React from 'react';
import * as ReactDom from 'react-dom';
import i18next from 'i18next';
import { createAbortError, throwAbortError } from '../../common/errors/abort-error';

export const enum ConfirmDialogChoiceSet {
    YesNo,
    OkAbort
}

export async function showConfirmDialog(message: string, choiceSet = ConfirmDialogChoiceSet.OkAbort, defaultBehavior = true) {
    const title = i18next.t('appTitle');

    const dialog = document.createElement('dialog') as HTMLUxpDialogElement;
    document.body.appendChild(dialog);

    ReactDom.render(
        <sp-body>
            <p>
                {message}
            </p>
            <div className="actions">
                {renderChoices(dialog, choiceSet)}
            </div>
        </sp-body>,
        dialog
    );
    
    const result = await dialog.uxpShowModal({
        title
    });

    dialog.remove();

    if (defaultBehavior && result === 'abort') {
        throw createAbortError();
    }

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

    const _confirm = () => dialog.close('ok');
    const _decline = () => dialog.close('abort');

    return <>
        <sp-action-button onClick={_confirm}>{i18next.t('ok')}</sp-action-button>
        <sp-action-button onClick={_decline}>{i18next.t('abort')}</sp-action-button>
    </>;

}