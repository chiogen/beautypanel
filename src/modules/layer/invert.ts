import { app } from "photoshop";
import { ActionDescriptor, Layer } from "photoshop";


export async function invert(layer: Layer) {
    const descriptor: ActionDescriptor = {
        _obj: "invert",
        _target: {
            _ref: 'layer',
            _id: layer._id
        }
    }

    const result = await app.batchPlay([descriptor], {});

    for (const item of result) {
        if (item.message) {
            await app.showAlert(item.message);
        }
    }
}