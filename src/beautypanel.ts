import AppInfo from '../app-info.json';
import { app } from 'photoshop'

const keys = Object.keys(window);

function showLayerNames() {
    const allLayers = app.activeDocument.layers;
    const allLayerNames = allLayers.map(layer => layer.name);
    const sortedNames = allLayerNames.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    document.getElementById("center").innerHTML = `
      <ul>${
        sortedNames.map(name => `<li>${name}</li>`).join("")
      }</ul>`;
}

document.body.addEventListener('load', () => {
    showLayerNames();
})

console.log(app)