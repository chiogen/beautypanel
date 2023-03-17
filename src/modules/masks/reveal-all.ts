import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { Layer } from 'photoshop/dom/Layer';
import { _selectLayers } from '../image/select-layers';

export interface RevealAllMaskOptions {
    layer: Layer
}

export async function createRevealAllMask(options: RevealAllMaskOptions): Promise<Layer> {

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

    const [, result] = await app.batchPlay([
        _selectLayers([options.layer]),
        descriptor
    ], {});

    if (result.message) {
        await app.showAlert(result.message);
    }

    return app.activeDocument!.activeLayers[0];

}