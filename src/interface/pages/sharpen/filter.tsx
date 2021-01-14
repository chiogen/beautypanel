import * as React from 'react'
import i18next from 'i18next'
import { ActionButton } from '@adobe/react-spectrum'

export const Filter = () => 
    <div className="section">
        <h3>${i18next.t('sharpen.filters')}</h3>
        <div className="flex-buttons">
            <ActionButton>{i18next.t('sharpen.unsharpen')}</ActionButton>
            <ActionButton>{i18next.t('sharpen.selective')}</ActionButton>
        </div>
        <div className="flex-buttons">
            <ActionButton>{i18next.t('sharpen.frequencySeparation')}</ActionButton>
            <ActionButton>{i18next.t('sharpen.marked')}</ActionButton>
        </div>      
    </div>
