import i18next from 'i18next';
import { core } from 'photoshop';
import * as React from 'react';
import { handleException } from '../../../common/errors/handle-error';
import { insertCopyright } from '../../../modules/actions/copyright';
import { TState, store } from '../../../store';
import { setCopyrightText } from '../../../reducer/copyright';
import { useSelector } from 'react-redux';
import { StorageKey } from '../../../enums/storage-key';

export const CopyrightSection = () => {

    const text = useSelector<TState, string>(state => state.copyright.text);

    return (
        <div id="copyright" className='section'>
            <h3>Copyright</h3>
            <div className="flex" style={{ justifyContent: 'stretch' }}>
                <sp-textarea placeholder='Text' style={{ flex: '1 1' }} value={text} onInput={onTextInput}></sp-textarea>
            </div>
            <sp-action-button style={{ display: 'flex' }} onClick={onInsertCopyrightClicked}>
                {i18next.t('copyright.title')}
            </sp-action-button>
        </div>
    );
};

function onTextInput(e: React.FormEvent<HTMLInputElement>) {
    try {
        const storedValue = store.getState().copyright.text;
        const value = e.currentTarget.value;

        if (value === storedValue)
            return;

        store.dispatch(setCopyrightText(e.currentTarget.value));
    } catch(err) {
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