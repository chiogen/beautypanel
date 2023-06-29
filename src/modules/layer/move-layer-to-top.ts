import { constants } from 'photoshop';
import { Layer } from 'photoshop/dom/Layer';

export function moveLayerToTop(layer: Layer) {

    const document = layer.document;

    const moveRefLayer = document.layers[0];
    if (moveRefLayer === layer)
        return;

    layer.move(moveRefLayer, constants.ElementPlacement.PLACEBEFORE);
}