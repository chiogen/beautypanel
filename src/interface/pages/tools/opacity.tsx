import i18next from "i18next";
import * as React from 'react'
import { AppUtils } from '../../../common/app-utils';
import { percent } from '../../../common/type-utils';
import { opacity as defaultPresets } from './default-presets.json'

export const Opacity = () => 
    <div className="section">
        <h3 className="title">{i18next.t('opacity')}</h3>
        <div className="flex-buttons">
            <sp-action-button data-index="0" onClick={onOpacityPresetClick}>{getPresetValue(0)}%</sp-action-button>
            <sp-action-button data-index="1" onClick={onOpacityPresetClick}>{getPresetValue(1)}%</sp-action-button>
            <sp-action-button data-index="2" onClick={onOpacityPresetClick}>{getPresetValue(2)}%</sp-action-button>
            <sp-action-button data-index="3" onClick={onOpacityPresetClick}>{getPresetValue(3)}%</sp-action-button>
            <sp-action-button data-index="4" onClick={onOpacityPresetClick}>{getPresetValue(4)}</sp-action-button>
        </div>
    </div>

async function onOpacityPresetClick(e: React.MouseEvent<HTMLButtonElement>) {
    const button = e.currentTarget as HTMLButtonElement;
    const index = parseInt(button.dataset.index);

    if (e.button === 0) {
        await applyOpacityPreset(index);
    }
}

async function applyOpacityPreset(index: number) {
    const value = getPresetValue(index);
    await AppUtils.setToolOptions({
        opacity: percent(value)
    });
}

function getPresetValue(index: number): number {
    const key = 'opacity-preset-' + index;
    let value = localStorage.getItem(key);
    return value ? parseInt(value) : defaultPresets[index];
}