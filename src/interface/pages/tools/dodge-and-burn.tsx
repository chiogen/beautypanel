import * as React from 'react'
import i18next from "i18next";
import { ActionDescriptor, app, Layer } from 'photoshop';
import { BeautyPanel, E_Layer } from '../../../common/beautypanel';
import { DocumentUtils } from '../../../common/document-utils';
import { LayerUtils } from '../../../common/layer-utils';
import { AppUtils } from '../../../common/app-utils';
import { confirm } from '../../dialogues/confirm';

export const DodgeAndBurn = () =>
    <div className="section">
        <h3 className="title">Dodge and Burn</h3>
        <div id="dodge-and-burn">
            <div className="flex-buttons">
                <sp-action-button onClick={executeDodgeAndBurnGradient}>{i18next.t('dodgeAndBurn.gradient')}</sp-action-button>
                <sp-action-button>{i18next.t('dodgeAndBurn.default')}</sp-action-button>
            </div>
            <div className="flex-buttons">
                <sp-action-button className="white">{i18next.t('dodgeAndBurn.white')}</sp-action-button>
                <sp-action-button className="gray" onClick={executeDodgeAndBurnGray}>{i18next.t('dodgeAndBurn.gray')}</sp-action-button>
                <sp-action-button className="black">{i18next.t('dodgeAndBurn.black')}</sp-action-button>
            </div>
            <div className="flex-buttons">
                <sp-action-button onClick={onBrushButtonClicked}>Brush</sp-action-button>
                <sp-action-button onClick={onStampButtonClicked}>Stamp</sp-action-button>
            </div>
        </div>
    </div>;

async function executeDodgeAndBurnGradient(e: React.MouseEvent<HTMLButtonElement>) {
    try {

        const document = app.activeDocument;
        await DocumentUtils.checkBitsPerChannel(document);

        document.backgroundLayer.visible = true;

        // Get maybe existing layers
        let bright = BeautyPanel.layers.bright;
        let dark = BeautyPanel.layers.dark;

        // Delete layers if they exist and the user has permitted it
        if (bright || dark) {
            if (confirm('Create new layers?')) {
                bright?.delete();
                dark?.delete();
                bright = dark = undefined;
            }
        }

        // ============================================ //
        // Create adjustment layer "Bright"
        if (!bright) {
            bright = await addCurvedAdjustmentLayer(
                BeautyPanel.getLayerName(E_Layer.Bright),
                [
                    [0, 0],
                    [84, 105],
                    [188, 234],
                    [255, 255]
                ]
            )
            await LayerUtils.invert(bright);
        }
        bright.visible = true;
        bright.blendMode = 'luminosity';

        // ============================================ //
        // Create adjustment layer "Dark"
        if (!dark) {
            dark = await addCurvedAdjustmentLayer(
                BeautyPanel.getLayerName(E_Layer.Dark),
                [
                    [0, 0],
                    [63, 21],
                    [166, 144],
                    [255, 255]
                ]
            );
            dark.visible = true;
            await LayerUtils.invert(dark);
        }
        dark.blendMode = 'luminosity';

        // Select brush to start painting
        AppUtils.selectTool('paintbrushTool');

    } catch (err) {
        const message = err.message || err;
        app.showAlert(message);
    }
}
async function executeDodgeAndBurnGray(e: React.MouseEvent<HTMLButtonElement>) {
    try {

        const document = app.activeDocument;

        // Preparations
        await DocumentUtils.checkBitsPerChannel(document);

        // Get maybe existing layers
        let layer = BeautyPanel.layers.dodgeAndBurnGray;

        // Delete layers if they exist and the user has permitted it
        if (layer) {
            if (confirm('Create new layers?')) {
                layer.delete();
                layer = undefined;
            }
        }

        if (!layer) {

            // Create new layer with blendmode SoftLight
            layer = await document.backgroundLayer.duplicate(undefined, BeautyPanel.getLayerName(E_Layer.DodgeAndBurnGray));
            layer.blendMode = 'softLight';
        
            // Fill layer with gray color (Don't know the actions in photoshop)
            const descriptor: ActionDescriptor = {
                _obj: 'fillContents'
            }

        }

        // Select brush to start painting
        AppUtils.selectTool('paintbrushTool');

    } catch (err) {
        const message = err.message || err;
        app.showAlert(message);
    }
}

async function onBrushButtonClicked(e: React.MouseEvent<HTMLButtonElement>) {
    try {
        await AppUtils.selectTool('paintbrushTool');
    } catch (err) {
        const message = err.message || err;
        app.showAlert(message);
    }

}
async function onStampButtonClicked(e: React.MouseEvent<HTMLButtonElement>) {
    try {
        await AppUtils.selectTool('cloneStampTool');
    } catch (err) {
        const message = err.message || err;
        await app.showAlert(message);
    }
}

async function addCurvedAdjustmentLayer(name: string, curve: Array<number[]>): Promise<Layer> {

    const layer = await app.activeDocument.backgroundLayer.duplicate(undefined, name);
    await DocumentUtils.setActiveLayers([layer]);

    const descriptor: ActionDescriptor = {
        _obj: 'curves',
        presetKind: {
            _enum: "presetKindType",
            _value: "presetKindCustom"
        },
        adjustment: [
            {
                _obj: "curvesAdjustment",
                channel: {
                    _ref: "channel",
                    _enum: "channel",
                    _value: "composite"
                },
                curve: curveArgument(curve)
            }
        ]
    };

    const result = await app.batchPlay([descriptor], {});
    for (const item of result) {
        if (item.message) {
            await app.showAlert(item.message);
        }
    }

    return layer;
}
function curveArgument(curve: Array<number[]>) {
    return curve.map(([x, y]) => {
        return {
            _obj: "paint",
            horizontal: x,
            vertical: y
        }
    });
}