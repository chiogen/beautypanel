import * as React from 'react'
import { Checkbox, Heading } from '@adobe/react-spectrum'
import i18next from 'i18next';

export const Options = () => (
    <div className="section options">
        <Heading>{i18next.t('options')}</Heading>
        <div className="checkbox">
            <sp-checkbox>{i18next.t('sharpen.switchToDetailLayer')}</sp-checkbox>
        </div>
    </div>
);