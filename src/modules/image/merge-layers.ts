import { app, Document, Layer } from "photoshop";
import { _selectLayers } from "./select-layers";

export async function mergeLayers(document: Document, layers: Layer[]): Promise<Layer> {

    const duplicates = await Promise.all(layers.map(async layer => layer.duplicate()));

    const results = await app.batchPlay([
        _selectLayers(duplicates),
        {
            _obj: "mergeLayersNew"
        }
    ]);

    for (const result of results) {
        if (result.message) {
            throw new Error(result.message);
        }
    }

    return document.activeLayers[0];
}