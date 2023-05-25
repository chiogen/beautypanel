import i18next from 'i18next';
import * as React from 'react';
import { handleException } from '../../../common/errors/handle-error';

export const CopyrightTool = () => {

    return (
        <div id="copyright" className='section'>
            <h3>Copyright</h3>
            <sp-action-button style={{ display: 'flex' }} onClick={insertCopyright}>
                {i18next.t('copyright.title')}
            </sp-action-button>
        </div>
    );
};

async function insertCopyright() {
    try {

        throw new Error('[insertCopyright] Not implemented');

    } catch(err) {
        handleException(err);
    }
}