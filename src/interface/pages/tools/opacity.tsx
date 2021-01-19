import { app } from 'photoshop'
import i18next from "i18next";
import * as React from 'react'

let defaultPresets = [2, 6, 32, 50, 100];

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

export const Opacity = () => 
    <div className="section">
        <h3 className="title">${i18next.t('opacity')}</h3>
        <div className="flex-buttons">
            <sp-action-button data-index="0" onClick={onOpacityPresetClick}>{presets[0]}%</sp-action-button>
            <sp-action-button data-index="1" onClick={onOpacityPresetClick}>{presets[1]}%</sp-action-button>
            <sp-action-button data-index="2" onClick={onOpacityPresetClick}>{presets[2]}%</sp-action-button>
            <sp-action-button data-index="3" onClick={onOpacityPresetClick}>{presets[3]}%</sp-action-button>
            <sp-action-button data-index="4" onClick={onOpacityPresetClick}>{presets[4]}%</sp-action-button>
        </div>
    </div>

function onOpacityPresetClick(e: React.MouseEvent<HTMLButtonElement>) {
    const button = e.currentTarget as HTMLButtonElement;
    const index = parseInt(button.dataset.index);

    switch (e.button) {
        case 0:
            applyOpacityPreset(index);
            break;
    }
}

function applyOpacityPreset(index: number) {
    
}