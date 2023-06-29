import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { Layer } from 'photoshop/dom/Layer';
import { selectLayers } from '../image/select-layers';

export async function createRevealAllMask(layer: Layer): Promise<Layer> {

    const descriptor: ActionDescriptor = {
        _obj: 'make',
        new: {
            '_class': 'channel'
        },
        at: {
            _ref: 'channel',
            _enum: 'channel',
            _value: 'mask'
        },
        using: {
            _enum: 'userMaskEnabled',
            _value: 'revealAll'
        }
    };

    await selectLayers([layer]);

    const [, result] = await app.batchPlay([
        descriptor
    ], {});

    if (result.message) {
        await app.showAlert(result.message);
    }

    return app.activeDocument!.activeLayers[0];

}