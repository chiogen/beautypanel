import { Layer } from 'photoshop/dom/Layer';

export async function selectLayers(layers: Layer[], makeVisible = false): Promise<void> {

    if (layers.length === 0)
        return;

    const document = layers[0].document;
    const layerIds = layers.map(x => x.id);

    for (const layer of document.layers) {
        layer.selected = layerIds.includes(layer.id);

        if (layer.selected && makeVisible)
            layer.visible = true;
    }

}