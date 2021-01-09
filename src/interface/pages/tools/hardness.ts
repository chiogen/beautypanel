import { app } from 'photoshop'
import { html } from "htm/react";
import i18next from "i18next";
import { Divider } from '@adobe/react-spectrum';

export const Hardness = () => html`
    <div>
        <h2 className="title">${i18next.t('hardness')}</h2>
        <${Divider} size="medium" />
        <div id="tools-hardness">
            <div className="profiles">
                <sp-action-button id="tools-hardness-profile-1" index="0" onClick="${onHardnessPresetClick}">0%</sp-action-button>
                <sp-action-button id="tools-hardness-profile-2" index="1" onClick="${onHardnessPresetClick}">25%</sp-action-button>
                <sp-action-button id="tools-hardness-profile-3" index="2" onClick="${onHardnessPresetClick}">50%</sp-action-button>
                <sp-action-button id="tools-hardness-profile-4" index="3" onClick="${onHardnessPresetClick}">75%</sp-action-button>
                <sp-action-button id="tools-hardness-profile-5" index="4" onClick="${onHardnessPresetClick}">100%</sp-action-button>					
            </div>
        </div>
    </div>
`;

function onHardnessPresetClick(e: MouseEvent) {

    const button = e.currentTarget as HTMLButtonElement;
    const index = parseInt(button.getAttribute('index'));
    const hardness = getHardnessPresetValue(index);

    app.activeDocument.activeLayers.forEach(layer => {
        
    });
}

export function getHardnessPresetValue(index: number): number {
    return 0;
}