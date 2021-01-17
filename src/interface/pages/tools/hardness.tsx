import * as React from 'react'
import i18next from "i18next";
import { ActionDescriptor, app } from 'photoshop';
import { percent } from '../../../common/type-utils';

export const Hardness = () => 
    <div className="section">
        <h2 className="title">{i18next.t('hardness')}</h2>
        <div className="flex-buttons">
            <sp-action-button data-index="0" onClick={onHardnessPresetClick}>0%</sp-action-button>
            <sp-action-button data-index="1" onClick={onHardnessPresetClick}>25%</sp-action-button>
            <sp-action-button data-index="2" onClick={onHardnessPresetClick}>50%</sp-action-button>
            <sp-action-button data-index="3" onClick={onHardnessPresetClick}>75%</sp-action-button>
            <sp-action-button data-index="4" onClick={onHardnessPresetClick}>100%</sp-action-button>					
        </div>
    </div>
;

async function onHardnessPresetClick(e: React.MouseEvent<HTMLButtonElement>) {

    const button = e.currentTarget as HTMLButtonElement;
    const index = parseInt(button.dataset.index);
    const hardness = getHardnessPresetValue(index);

    const descriptor: ActionDescriptor = {
        _obj: 'select',
        _target: {
            _ref: 'currentTool',
            _enum: 'ordinal'
        },
        hardness: percent(hardness)
    };

    const result = await app.batchPlay([descriptor], {});

    for (const entry of result) {
        if (entry.message) {
            app.showAlert(entry.message);
        }
    }

}

export function getHardnessPresetValue(index: number): number {
    return 50;
}