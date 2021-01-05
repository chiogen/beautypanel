import AppInfo from './app-info.json';

async function showLayerNames() {
    const { app } = await import("photoshop");
    const allLayers = app.activeDocument.layers;
    const allLayerNames = allLayers.map(layer => layer.name);
    const sortedNames = allLayerNames.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    document.getElementById("layers").innerHTML = `
      <ul>${
        sortedNames.map(name => `<li>${name}</li>`).join("")
      }</ul>`;
}

console.log(AppInfo)
document.getElementById("btnPopulate").addEventListener("click", showLayerNames);