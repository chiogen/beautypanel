import { ActionDescriptor, app, Layer } from "photoshop";
import { pixels } from "../../../common/units";


export function _surfaceBlur(layer: Layer, radius: number, threshold: number) {
    const descriptor: ActionDescriptor = {
        _obj: "surfaceBlur",
        _target: {
            _ref: 'layer',
            _id: layer._id
        },
        radius: pixels(radius),
        threshold: threshold
    };

    return descriptor;
}

export async function surfaceBlur(layer: Layer, radius: number, threshold: number) {

    const result = await app.batchPlay([
        _surfaceBlur(layer, radius, threshold)
    ], {});

    for (const item of result) {
        if (item.message) {
            await app.showAlert(item.message);
        }
    }
}