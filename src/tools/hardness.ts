import { app } from 'photoshop'

// Initialize
document.body.querySelectorAll('#tools-hardness .profiles sp-button').forEach(button => {
    button.addEventListener('click', onHardnessPresetButtonClick);
});


function onHardnessPresetButtonClick(e: MouseEvent) {

    const button = e.currentTarget as HTMLButtonElement;
    const index = parseInt(button.getAttribute('index'));
    const hardness = getHardnessPresetValue(index);

    app.activeDocument.activeLayers.forEach(layer => {
        
    });
}

export function getHardnessPresetValue(index: number): number {
    return 0;
}