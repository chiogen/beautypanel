import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { percent } from '../../../common/units';
import { DialogOptions } from '../../../enums/dialog-options';

export interface FilterReduceNoiseOptions {
    sharpen?: number
    colorNoise?: number
    removeJPEGArtifact?: boolean

    dialogOptions?: DialogOptions
}

export function _channelDenoise(): ActionDescriptor[] {
    return [
        {
            _obj: 'channelDenoiseParams',
            channel: {
                '_ref': 'channel',
                '_enum': 'channel',
                '_value': 'composite'
            },
            amount: 10,
            edgeFidelity: 50
        },
        {
            _obj: 'channelDenoiseParams',
            channel: {
                _ref: 'channel',
                _enum: 'channel',
                _value: 'red'
            },
            amount: 0
        },
        {
            _obj: 'channelDenoiseParams',
            channel: {
                _ref: 'channel',
                _enum: 'channel',
                _value: 'grain'
            },
            amount: 0
        },
        {
            _obj: 'channelDenoiseParams',
            channel: {
                _ref: 'channel',
                _enum: 'channel',
                _value: 'blue'
            },
            amount: 0
        }
    ];
}
export function _filterReduceNoise(options: FilterReduceNoiseOptions) {

    const descriptor: ActionDescriptor = {
        _obj: 'denoise',
        channelDenoise: _channelDenoise(),
        removeJPEGArtifact: options.removeJPEGArtifact ?? false,
        _options: {
            dialogOptions: options.dialogOptions ?? DialogOptions.DontDisplay
        }
    };

    if (typeof options.sharpen === 'number') {
        descriptor.sharpen = percent(options.sharpen);
    }

    if (typeof options.colorNoise === 'number') {
        descriptor.colorNoise = percent(options.colorNoise);
    }

    return descriptor;
}
export async function filterReduceNoise(options: FilterReduceNoiseOptions): Promise<ActionDescriptor> {

    const [result] = await app.batchPlay([
        _filterReduceNoise(options)
    ], {});

    if (result.message) {
        throw new Error(result.message);
    }

    return result;
}