import * as React from 'react'
import { app } from 'photoshop'
import i18next from "i18next";
import { AppUtils } from '../../../common/app-utils';

export const Hardness = () => 
    <div className="section">
        <h2 className="title">${i18next.t('hardness')}</h2>
        <div className="flex-buttons">
            <sp-action-button id="tools-hardness-profile-1" data-index="0" onClick={onHardnessPresetClick}>0%</sp-action-button>
            <sp-action-button id="tools-hardness-profile-2" data-index="1" onClick={onHardnessPresetClick}>25%</sp-action-button>
            <sp-action-button id="tools-hardness-profile-3" data-index="2" onClick={onHardnessPresetClick}>50%</sp-action-button>
            <sp-action-button id="tools-hardness-profile-4" data-index="3" onClick={onHardnessPresetClick}>75%</sp-action-button>
            <sp-action-button id="tools-hardness-profile-5" data-index="4" onClick={onHardnessPresetClick}>100%</sp-action-button>					
        </div>
    </div>
;

function onHardnessPresetClick(e: React.MouseEvent<HTMLButtonElement>) {

    const button = e.currentTarget as HTMLButtonElement;
    const index = parseInt(button.dataset.index);
    const hardness = getHardnessPresetValue(index);

}

export function getHardnessPresetValue(index: number): number {
    return 0;
}