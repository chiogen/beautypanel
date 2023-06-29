import { app, constants } from 'photoshop';
import { Layer } from 'photoshop/dom/Layer';
import { BeautyPanel, E_Layer } from '../../common/beautypanel';
import { useDodgeAndBurnColor } from '../../reducer/tools';
import { store } from '../../store';
import { setForegroundColor } from '../application/foreground-color';
import { selectTool } from '../application/select-tool';
import { checkBitsPerChannel } from '../image/bits-per-channel';
import { selectLayers } from '../image/select-layers';
import { invert } from '../layer/invert';
import { showConfirmDialog } from '../ui/confirm';
import { checkDescriptorError, checkDescriptorErrors } from '../../common/errors/handle-error';

export async function executeDodgeAndBurn() {

    const document = app.activeDocument;
    if (!document)
        return;

    // Preparations
    await checkBitsPerChannel(document);

    // Get maybe existing layers
    let layer = BeautyPanel.layers.dodgeAndBurnGray;

    // Delete layers if they exist and the user has permitted it
    if (layer) {
        const deleteConfirmed = await showConfirmDialog('Create new layers?');
        if (deleteConfirmed) {
            layer.delete();
            layer = null;
        }
    }

    // Pick fill to center of image
    const [fillResult] = await app.batchPlay([
        {
            _obj: 'make',
            _target: [
                {
                    _ref: 'layer'
                }
            ],
            using: {
                _obj: 'layer',
                name: BeautyPanel.getLayerName(E_Layer.DodgeAndBurn),
                mode: {
                    _enum: 'blendMode',
                    _value: 'softLight'
                },
                fillNeutral: true,
                color: {
                    _enum: 'color',
                    _value: 'gray'
                }
            }
        }
    ], {});

    checkDescriptorError(fillResult);

    await selectTool('paintbrushTool');
    await setForegroundColor(255, 255, 255);

}

export async function executeDodgeAndBurnWithGradient() {

    const document = app.activeDocument;
    if (!document)
        return;

    await checkBitsPerChannel(document);

    const sourceLayer = document.backgroundLayer ?? document.layers[0];
    sourceLayer.visible = true;

    // Get maybe existing layers
    let bright = BeautyPanel.layers.bright;
    let dark = BeautyPanel.layers.dark;

    // Delete layers if they exist and the user has permitted it
    if (bright || dark) {
        const deleteConfirmed = await showConfirmDialog('Create new layers?');
        if (deleteConfirmed) {
            bright?.delete();
            dark?.delete();
            bright = dark = null;
        }
    }

    // ============================================ //
    // Create adjustment layer "Bright"
    if (!bright) {
        bright = await addCurvedAdjustmentLayer(
            sourceLayer,
            BeautyPanel.getLayerName(E_Layer.Bright),
            [
                [0, 0],
                [84, 105],
                [188, 234],
                [255, 255]
            ]
        );
        await invert(bright);
    }
    bright.visible = true;
    bright.blendMode = constants.BlendMode.LUMINOSITY;

    // ============================================ //
    // Create adjustment layer "Dark"
    if (!dark) {
        dark = await addCurvedAdjustmentLayer(
            sourceLayer,
            BeautyPanel.getLayerName(E_Layer.Dark),
            [
                [0, 0],
                [63, 21],
                [166, 144],
                [255, 255]
            ]
        );
        await invert(dark);
    }
    dark.visible = true;
    dark.blendMode = constants.BlendMode.LUMINOSITY;

    // Select brush to start painting
    selectTool('paintbrushTool');

}

async function addCurvedAdjustmentLayer(sourceLayer: Layer, name: string, curve: Array<number[]>): Promise<Layer> {

    const layer = await sourceLayer.duplicate();
    if (!layer)
        throw new Error(`Photoshop did not create "${name}" Layer`);

    layer.name = name;

    const results = await app.batchPlay([
        {
            _obj: 'select',
            _target: {
                _ref: 'layer',
                _id: layer.id
            }
        },
        {
            _obj: 'curves',
            presetKind: {
                _enum: 'presetKindType',
                _value: 'presetKindCustom'
            },
            adjustment: [
                {
                    _obj: 'curvesAdjustment',
                    channel: {
                        _ref: 'channel',
                        _enum: 'channel',
                        _value: 'composite'
                    },
                    curve: curveArgument(curve)
                }
            ]
        }
    ], {});

    checkDescriptorErrors(results);

    return layer;
}
function curveArgument(curve: Array<number[]>) {
    return curve.map(([x, y]) => {
        return {
            _obj: 'paint',
            horizontal: x,
            vertical: y
        };
    });
}



export const setColorForDodgeAndBurn = (colorCode: string) => async () => {

    let grayscale = 128;
    if (colorCode === 'white') {
        grayscale = 255;
    } else if (colorCode === 'black') {
        grayscale = 0;
    }

    const layer = BeautyPanel.layers.dodgeAndBurnGray;
    if (!layer) {
        throw new Error('You must run Dodge&Burn first.');
    }

    await selectTool('paintbrushTool');
    await setForegroundColor(grayscale);

    layer.visible = true;
    await selectLayers([layer]);

    store.dispatch(useDodgeAndBurnColor(colorCode));

};

export const selectToolForDodgeAndBurn = (toolName: string) => async () => {
    await selectTool(toolName);
};