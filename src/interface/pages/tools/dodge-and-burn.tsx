import * as React from 'react'
import { html } from "htm/react";
import i18next from "i18next";

export const DodgeAndBurn = () => 
    <div className="section">
        <h3 className="title">Dodge and Burn</h3>
        <div id="dodge-and-burn">
            <div className="flex-buttons">
                <sp-action-button>{i18next.t('dodgeAndBurn.gradient')}</sp-action-button>
                <sp-action-button>{i18next.t('dodgeAndBurn.default')}</sp-action-button>
            </div>
            <div className="flex-buttons">
                <sp-action-button className="white">{i18next.t('dodgeAndBurn.white')}</sp-action-button>
                <sp-action-button className="gray">{i18next.t('dodgeAndBurn.gray')}</sp-action-button>
                <sp-action-button className="black">{i18next.t('dodgeAndBurn.black')}</sp-action-button>
            </div>
            <div className="flex-buttons">
                <sp-action-button>Brush</sp-action-button>
                <sp-action-button>Stamp</sp-action-button>
            </div>
        </div>
    </div>
;