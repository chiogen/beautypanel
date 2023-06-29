import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { Layer } from 'photoshop/dom/Layer';
import { selectLayers } from '../image/select-layers';
import { checkDescriptorError } from '../../common/errors/handle-error';

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

    const [result] = await app.batchPlay([
        descriptor
    ], {});

    checkDescriptorError(result);

    return app.activeDocument!.activeLayers[0];

}