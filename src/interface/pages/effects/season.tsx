import i18next from "i18next";
import { ActionDescriptor, app, Document } from "photoshop";
import { BeautyPanel, E_Layer } from "../../../common/beautypanel";
import { percent } from "../../../common/units";
import { confirm } from "../../dialogues/confirm";


export type ColorCorrectionColor = 'reds' | 'yellows' | 'greens' | 'cyans' | 'blues' | 'magentas' | 'whites' | 'neutrals' | 'blacks'
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

const springToAutumn: SeasonProfile = {
    layerOpacity: 100,
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
};

export async function createAutumnEffect(e: React.MouseEvent<HTMLButtonElement>) {
    try {

        if (e.altKey) {
            optAutumnEffect();
            return;
        }

        const profile = springToAutumn;
        const opacity = localStorage.getItem('autumnLayerOpacity');
        if (opacity) {
            profile.layerOpacity = parseInt(opacity);
        }

        await createSeasonEffect(BeautyPanel.getLayerName(E_Layer.Autumn), profile);
    } catch (err) {
        app.showAlert(err.message)
    }
}
function optAutumnEffect() {
    const key = 'autumnLayerOpacity'
    const layerName = BeautyPanel.getLayerName(E_Layer.Autumn)
    const layer = BeautyPanel.getLayerByCode(E_Layer.Autumn);

    if (layer) {
        localStorage.setItem(key, String(layer.opacity));
        app.showAlert('Opacity value saved.');
    } else {
        app.showAlert(i18next.t('layerNotFound', { name: layerName }));
    }

}

export async function createSpringEffect(_e: React.MouseEvent<HTMLButtonElement>) {
    try {

        throw new Error('No profile defined.');

        // if (_e.altKey) {
        //     optAutumnEffect();
        //     return;
        // }

        // const profile = springToAutumn;
        // const opacity = localStorage.getItem('springLayerOpacity');
        // if (opacity) {
        //     profile.layerOpacity = parseInt(opacity);
        // }

        // await createSeasonEffect(BeautyPanel.getLayerName(E_Layer.Spring), profile);
        
    } catch (err) {
        app.showAlert(err.message)
    }
}
function optSpringEffect() {
    const key = 'springLayerOpacity'
    const layerName = BeautyPanel.getLayerName(E_Layer.Autumn)
    const layer = BeautyPanel.getLayerByCode(E_Layer.Autumn);

    if (layer) {
        localStorage.setItem(key, String(layer.opacity));
        app.showAlert('Opacity value saved.');
    } else {
        app.showAlert(i18next.t('layerNotFound', { name: layerName }));
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