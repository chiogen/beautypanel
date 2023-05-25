import i18next from 'i18next';
import * as React from 'react';
import { handleException } from '../../../common/errors/handle-error';
import { app } from 'photoshop';
import { insertCopyright } from '../../../modules/actions/copyright';

export const CopyrightTool = () => {

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

        await app.batchPlay(insertCopyright, {
            commandName: 'Insert copyright'
        });

    } catch(err) {
        handleException(err);
    }
}