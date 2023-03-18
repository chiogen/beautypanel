import { app } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { Document } from 'photoshop/dom/Document';
import { BeautyPanel } from '../../common/beautypanel';
import { percent } from '../../common/units';
import { showConfirmDialog } from '../ui/confirm';

export type ColorCorrectionColor = 'reds' | 'yellows' | 'greens' | 'cyans' | 'blues' | 'magentas' | 'whites' | 'neutrals' | 'blacks';
export interface SeasonProfile {
    layerOpacity: number
    colorCorrection: Array<SeasonColorCorrection>
}
export interface SeasonColorCorrection {
    color: ColorCorrectionColor,
    cyan: number
    magenta: number
    yellow: number
    black: number
}

/**
 * Source: http://www.psd-dude.com/tutorials/how-to-change-season-autumn-effect-in-photoshop.aspx
 */
export async function createSeasonEffect(name: string, profile: SeasonProfile) {
    try {

        const document = app.activeDocument!;
        const referenceLayer = document.backgroundLayer! ?? document.layers[0];

        referenceLayer.visible = true;
        // referenceLayer.locked = true;

        let layer = BeautyPanel.getLayerByName(name);

        // Check layers
        if (layer) {
            const deleteConfirmed = await showConfirmDialog('Overwrite existing layers?');
            if (deleteConfirmed) {
                layer.delete();
                layer = null;
            } else {
                return;
            }
        }

        if (!layer) {
            layer = await createSelectiveColorLayer(document, profile);
            layer.name = name;
            layer.opacity = profile.layerOpacity;
        }

        return layer;

    } catch (err) {
        const message = err.message || err;
        app.showAlert(message);
    }
}


async function createSelectiveColorLayer(document: Document, profile: SeasonProfile) {
    const [result] = await app.batchPlay([
        _selectiveColor(),
        _setColorCorrection(profile.colorCorrection)
    ], {});

    if (result.message) {
        await app.showAlert(result.message);
    }

    return document.activeLayers[0];
}
function _selectiveColor(): ActionDescriptor {
    return {
        _obj: 'make',
        _target: [
            {
                _ref: 'adjustmentLayer'
            }
        ],
        using: {
            _obj: 'adjustmentLayer',
            type: {
                _obj: 'selectiveColor',
                presetKind: {
                    _enum: 'presetKindType',
                    _value: 'presetKindDefault'
                }
            }
        }
    };
}

function _setColorCorrection(correction: SeasonColorCorrection[]) {
    const descriptor: ActionDescriptor = {
        _obj: 'set',
        _target: [
            {
                _ref: 'adjustmentLayer',
                _enum: 'ordinal',
                _value: 'targetEnum'
            }
        ],
        to: {
            _obj: 'selectiveColor',
            method: {
                _enum: 'correctionMethod',
                _value: 'absolute'
            },
            colorCorrection: correction.map(colorCorrection)
        }
    };

    return descriptor;
}

function colorCorrection({ color, cyan, magenta, yellow, black }: SeasonColorCorrection) {
    const descriptor = {
        _obj: 'colorCorrection',
        colors: {
            _enum: 'colors',
            _value: color
        },
        cyan: percent(cyan),
        magenta: percent(magenta),
        yellowColor: percent(yellow),
        black: percent(black)
    };

    return descriptor;
}