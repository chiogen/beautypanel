import * as React from 'react'
import { Checkbox } from '@adobe/react-spectrum'
import i18next from 'i18next';

export const Options = () => 
    <div className="section">
        <h3 className="title">{i18next.t('options')}</h3>
        <div id="sharpen-options">
            <Checkbox>{i18next.t('sharpen.switchToDetailLayer')}</Checkbox>
        </div>
    </div>
    ;