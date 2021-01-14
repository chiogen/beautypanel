import * as React from 'react'
import i18next from 'i18next'

export const Filter = () => 
    <div className="section">
        <h3>${i18next.t('sharpen.filters')}</h3>
        <div className="flex-buttons">
            <sp-action-button>{i18next.t('sharpen.unsharpen')}</sp-action-button>
            <sp-action-button>{i18next.t('sharpen.selective')}</sp-action-button>
        </div>
        <div className="flex-buttons">
            <sp-action-button>{i18next.t('sharpen.frequencySeparation')}</sp-action-button>
            <sp-action-button>{i18next.t('sharpen.marked')}</sp-action-button>
        </div>      
    </div>
