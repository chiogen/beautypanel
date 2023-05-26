import i18next from 'i18next';
import { core } from 'photoshop';
import * as React from 'react';
import { handleException } from '../../../common/errors/handle-error';
import { insertCopyright } from '../../../modules/actions/copyright';

export const CopyrightSection = () => {

    return (
        <div id="copyright" className='section'>
            <h3>Copyright</h3>
            <sp-action-button style={{ display: 'flex' }} onClick={onInsertCopyrightClicked}>
                {i18next.t('copyright.title')}
            </sp-action-button>
        </div>
    );
};

async function onInsertCopyrightClicked() {
    try {

        await core.executeAsModal(insertCopyright, {
            commandName: 'Insert copyright'
        });

    } catch(err) {
        handleException(err);
    }
}