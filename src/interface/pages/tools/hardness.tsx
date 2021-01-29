import * as React from 'react'
import i18next from "i18next";
import { percent } from '../../../common/type-utils';
import { hardness as defaultPresets } from './default-presets.json'
import { AppUtils } from '../../../common/app-utils';

let numberOfPresets = 5;
let presets: Array<number> = new Array(numberOfPresets);

for (let i = 0; i < numberOfPresets; i++) {
    let value = localStorage.getItem('opacity-preset-' + i);
    if (value) {
        presets[i] = parseFloat(value);
    } else {
        presets[i] = defaultPresets[i];
    }
}


export const Hardness = () => 
    <div className="section">
        <h2 className="title">{i18next.t('hardness')}</h2>
        <div className="flex-buttons">
            <sp-action-button data-index="0" onClick={onHardnessPresetClick}>{getPresetValue(0)}%</sp-action-button>
            <sp-action-button data-index="1" onClick={onHardnessPresetClick}>{getPresetValue(1)}%</sp-action-button>
            <sp-action-button data-index="2" onClick={onHardnessPresetClick}>{getPresetValue(2)}%</sp-action-button>
            <sp-action-button data-index="3" onClick={onHardnessPresetClick}>{getPresetValue(3)}%</sp-action-button>
            <sp-action-button data-index="4" onClick={onHardnessPresetClick}>{getPresetValue(4)}%</sp-action-button>					
        </div>
    </div>
;

async function onHardnessPresetClick(e: React.MouseEvent<HTMLButtonElement>) {

    const button = e.currentTarget as HTMLButtonElement;
    const index = parseInt(button.dataset.index!);

    if (e.button === 0) {
        await applyHardnessPreset(index);
    }

}

async function applyHardnessPreset(index: number) {
    const value = getPresetValue(index);
    await AppUtils.setToolOptions({
        hardness: percent(value)
    });
}

function getPresetValue(index: number): number {
    const key = 'hardness-preset-' + index;
    let value = localStorage.getItem(key);
    return value ? parseInt(value) : defaultPresets[index];
}