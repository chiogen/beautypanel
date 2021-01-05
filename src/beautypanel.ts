import AppInfo from '../app-info.json';
import { app } from 'photoshop'

const keys = Object.keys(window);

function showLayerNames() {
    const allLayers = app.activeDocument.layers;
    const allLayerNames = allLayers.map(layer => layer.name);
    document.getElementById("center").innerHTML = `
      <ul>${
        allLayerNames.map(name => `<li>${name}</li>`).join("")
      }</ul>`;
}
showLayerNames();

console.log(app)