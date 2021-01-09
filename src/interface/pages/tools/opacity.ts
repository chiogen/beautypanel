import { app } from 'photoshop'
import { html } from "htm/react";
import i18next from "i18next";
import { Divider } from '@adobe/react-spectrum';

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

export const Opacity = () => html`
    <div>
        <h3 className="title">${i18next.t('opacity')}</h3>
        <${Divider} size="medium" />
        <div id="tools-opacity">
            <div className="profiles">
                <sp-action-button index="0" onClick="${onOpacityPresetClick}">${presets[0]}%</sp-action-button>
                <sp-action-button index="1" onClick="${onOpacityPresetClick}">${presets[1]}%</sp-action-button>
                <sp-action-button index="2" onClick="${onOpacityPresetClick}">${presets[2]}%</sp-action-button>
                <sp-action-button index="3" onClick="${onOpacityPresetClick}">${presets[3]}%</sp-action-button>
                <sp-action-button index="4" onClick="${onOpacityPresetClick}">${presets[4]}%</sp-action-button>
            </div>
        </div>
    </div>
`;

function onOpacityPresetClick(e: MouseEvent) {
    const button = e.currentTarget as HTMLButtonElement;
    const index = parseInt(button.getAttribute('index'));

    switch (e.button) {
        case 0:
            applyOpacityPreset(index);
            break;
    }
}

function applyOpacityPreset(index: number) {
    app.activeDocument.activeLayers.forEach(layer => {
        layer.opacity = presets[index];
    });
}