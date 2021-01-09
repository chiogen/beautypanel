import { app } from 'photoshop'

let defaultPresets = [2, 6, 32, 50, 100];

let numberOfPresets = 5;
let presets: Array<number> = new Array(numberOfPresets);

document.body.addEventListener('load', initialize);

// Initialize
function initialize() {

    for (let i = 0; i < numberOfPresets; i++) {
        let value = localStorage.getItem('opacity-preset-' + i);
        if (value) {
            presets[i] = parseFloat(value);
        } else {
            presets[i] = defaultPresets[i];
        }

        const button = getPresetButton(i);
        button.innerHTML = value + "%";
        button.addEventListener('click', onOpacityPresetButtonClick);
    }

}

function getPresetButton(index: number) {
    const id = `tools-opacity-profile-${index}`;
    return document.getElementById(id) as HTMLButtonElement;
}

function onOpacityPresetButtonClick(e: MouseEvent) {
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