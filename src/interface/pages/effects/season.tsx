import { ActionDescriptor, app, Document } from "photoshop";
import { BeautyPanel, E_Layer } from "../../../common/beautypanel";
import { percent } from "../../../common/units";
import { confirm } from "../../dialogues/confirm";


export type ColorCorrectionColor = 'reds' | 'yellows' | 'greens' | 'cyans' | 'blues' | 'magentas' | 'whites' | 'neutrals' | 'blacks'
export interface SeasonProfile {
    colorCorrection: Array<SeasonColorCorrection>
}
export interface SeasonColorCorrection {
    color: ColorCorrectionColor,
    cyan: number
    magenta: number
    yellow: number
    black: number
}

const springToAutumn: SeasonProfile = {
    colorCorrection: [
        {
            color: 'reds',
            cyan: 1,
            magenta: 2,
            yellow: 3,
            black: 0
        },
        {
            color: 'yellows',
            cyan: -100,
            magenta: 42,
            yellow: 40,
            black: 0
        },
        {
            color: 'greens',
            cyan: 100,
            magenta: 100,
            yellow: 100,
            black: 100
        }
    ]
}

export async function createAutumnEffect(_e: React.MouseEvent<HTMLButtonElement>) {
    try {
        await createSeasonEffect(BeautyPanel.getLayerName(E_Layer.Autumn), springToAutumn);
    } catch (err) {
        app.showAlert(err.message)
    }
}

export async function createSpringEffect(_e: React.MouseEvent<HTMLButtonElement>) {
    try {
        await createSeasonEffect(BeautyPanel.getLayerName(E_Layer.Spring), springToAutumn);
    } catch (err) {
        app.showAlert(err.message)
    }
}

/**
 * Source: http://www.psd-dude.com/tutorials/how-to-change-season-autumn-effect-in-photoshop.aspx
 */
export async function createSeasonEffect(name: string, profile: SeasonProfile) {
    try {

        const document = app.activeDocument!;
        const referenceLayer = document.backgroundLayer!;

        referenceLayer.visible = true;
        referenceLayer.locked = true;

        let layer = BeautyPanel.getLayerByName(name);

        // Check layers
        if (layer) {
            if (confirm('Overwrite existing layers?')) {
                layer.delete();
                layer = undefined;
            } else {
                return;
            }
        }

        if (!layer) {
            layer = await createSelectiveColorLayer(document, profile);
            layer.name = name;
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
    ]);

    if (result.message) {
        await app.showAlert(result.message);
    }

    return document.activeLayers[0];
}
function _selectiveColor(): ActionDescriptor {
    return {
        _obj: "make",
        _target: [
            {
                _ref: "adjustmentLayer"
            }
        ],
        using: {
            _obj: "adjustmentLayer",
            type: {
                _obj: "selectiveColor",
                presetKind: {
                    _enum: "presetKindType",
                    _value: "presetKindDefault"
                }
            }
        }
    }
}

function _setColorCorrection(correction: SeasonColorCorrection[]) {
    const descriptor: ActionDescriptor = {
        _obj: "set",
        _target: [
            {
                _ref: "adjustmentLayer",
                _enum: "ordinal",
                _value: "targetEnum"
            }
        ],
        to: {
            _obj: "selectiveColor",
            method: {
                _enum: "correctionMethod",
                _value: "absolute"
            },
            colorCorrection: correction.map(colorCorrection)
        }
    };

    return descriptor;
}

function colorCorrection({ color, cyan, magenta, yellow, black }: SeasonColorCorrection) {
    const descriptor = {
        _obj: "colorCorrection",
        colors: {
            _enum: "colors",
            _value: color
        },
        cyan: percent(cyan),
        magenta: percent(magenta),
        yellowColor: percent(yellow),
        black: percent(black)
    };

    return descriptor;
}