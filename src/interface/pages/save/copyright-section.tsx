import type { Textfield } from '@spectrum-web-components/textfield';
import i18next from 'i18next';
import { core } from 'photoshop';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { handleException } from '../../../common/errors/handle-error';
import { Card } from '../../../components/card';
import { StorageKey } from '../../../enums/storage-key';
import { insertCopyright } from '../../../modules/actions/copyright';
import { setCopyrightText } from '../../../reducer/copyright';
import { TState, store } from '../../../store';

export const CopyrightSection = () => {
    const text = useSelector<TState, string>(state => state.copyright.text);

    return (
        <Card title='Copyright'>
            <div className="copyright-text-container flex">
                <sp-textarea placeholder='Text' value={text} onInput={onTextInput}></sp-textarea>
            </div>
            <sp-action-button style={{ display: 'flex' }} onClick={onInsertCopyrightClicked}>
                {i18next.t('copyright.title')}
            </sp-action-button>
        </Card>
    );
};

function onTextInput(e: React.FormEvent<Textfield>) {
    try {
        const storedValue = store.getState().copyright.text;
        const value = e.currentTarget.value;

        if (value === storedValue)
            return;

        store.dispatch(setCopyrightText(e.currentTarget.value));
    } catch (err) {
        handleException(err);
    }
}

async function onInsertCopyrightClicked() {
    try {

        const text = store.getState().copyright.text;

        await core.executeAsModal(() => insertCopyright(text), {
            commandName: 'Insert copyright'
        });

        localStorage.setItem(StorageKey.CopyrightText, text);

    } catch (err) {
        handleException(err);
    }
}