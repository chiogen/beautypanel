import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { Layer } from 'photoshop/dom/Layer';


export async function invert(layer: Layer) {
    const descriptor: ActionDescriptor = {
        _obj: 'invert',
        _target: {
            _ref: 'layer',
            _id: layer.id
        }
    };

    const result = await app.batchPlay([descriptor], {});

    for (const item of result) {
        if (item.message) {
            await app.showAlert(item.message);
        }
    }
}