import { app } from 'photoshop'

let defaultPresets = [2, 6, 32, 50, 100];

let numberOfPresets = 5;
let presets: Array<number> = new Array(numberOfPresets);

// Initialize
const buttons = document.querySelectorAll('#tools-opacity profiles sp-button');
buttons.forEach(button => {
    button.addEventListener('click', onOpacityPresetButtonClick);
});

for (let i = 0; i < numberOfPresets; i++) {
    let value = localStorage.getItem('opacity-preset-' + i);
    if (value) {
        presets[i] = parseFloat(value);
    } else {
        presets[i] = defaultPresets[i];
    }

    buttons[i].innerHTML = value + "%";
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