import * as React from 'react'
import i18next from 'i18next'
import { Heading } from '@adobe/react-spectrum'

export const Filter = () => (
    <div className="section filters">
        <Heading>{i18next.t('sharpen.filters')}</Heading>
        <div className="flex-buttons">
            <sp-action-button># {i18next.t('sharpen.unsharpen')}</sp-action-button>
            <sp-action-button># {i18next.t('sharpen.selective')}</sp-action-button>
        </div>
        <div className="flex-buttons">
            <sp-action-button># {i18next.t('sharpen.frequencySeparation')}</sp-action-button>
            <sp-action-button># {i18next.t('sharpen.masked')}</sp-action-button>
        </div>      
    </div>
);