import * as React from 'react'
import i18next from "i18next";
import { ActionDescriptor, app, Layer } from 'photoshop';
import { BeautyPanel, E_Layer } from '../../../common/beautypanel';
import { DocumentUtils } from '../../../common/document-utils';
import { LayerUtils } from '../../../common/layer-utils';
import { selectTool } from '../../../common/app-utils';
import { confirm } from '../../dialogues/confirm';
import { StatefulComponent } from '../../../components/base/stateful-component';
import { store, TState } from '../../../store';
import { property } from '../../../decorators/react-property';
import { percent } from '../../../common/type-utils';

interface State {
    currentTool: string
}

export class DodgeAndBurn extends StatefulComponent<{}, State> {

    @property
    currentTool: string

    constructor(props: {}) {
        super(props);
        const state = store.getState();
        this.state = {
            currentTool: state.currentTool
        };
    }

    render() {
        return (
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
                    <div className="current-tool-buttons flex-buttons">
                        <sp-action-button data-active={this.currentTool === 'paintbrushTool'} onClick={onBrushButtonClicked}>Brush</sp-action-button>
                        <sp-action-button data-active={this.currentTool === 'cloneStampTool'} onClick={onStampButtonClicked}>Stamp</sp-action-button>
                    </div>
                </div>
            </div>
        );
    }

    stateChanged(state: TState) {
        this.currentTool = state.currentTool;
    }

}

async function executeDodgeAndBurnGradient(e: React.MouseEvent<HTMLButtonElement>) {

    if (!app.activeDocument) {
        return;
    }

    try {

        const document = app.activeDocument;
        await DocumentUtils.checkBitsPerChannel(document);

        const sourceLayer = document.backgroundLayer ?? document.layers[0];
        sourceLayer.visible = true;

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
                sourceLayer,
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
                sourceLayer,
                BeautyPanel.getLayerName(E_Layer.Dark),
                [
                    [0, 0],
                    [63, 21],
                    [166, 144],
                    [255, 255]
                ]
            );
            await LayerUtils.invert(dark);
        }
        dark.visible = true;
        dark.blendMode = 'luminosity';

        // Select brush to start painting
        selectTool('paintbrushTool');

    } catch (err) {
        const message = err.message || err;
        app.showAlert(message);
    }
}
async function executeDodgeAndBurnGray(e: React.MouseEvent<HTMLButtonElement>) {

    if (!app.activeDocument) {
        return;
    }

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

            const descriptor: ActionDescriptor = {
                _obj: 'make',
                _target: [
                    {
                        _ref: "contentLayer"
                    }
                ],
                using: {
                    _obj: 'contentLayer',
                    name: BeautyPanel.getLayerName(E_Layer.DodgeAndBurnGray),
                    color: {
                        _enum: 'color',
                        _value: 'gray'
                    },
                    type: {
                        _obj: 'solidColorLayer',
                        color: {
                            _obj: 'RGBColor',
                            red: 0,
                            grain: 0,
                            blue: 0
                        }
                    }
                },
                _options: {
                    dialogOptions: "dontDisplay"
                }
            };

            const [result] = await app.batchPlay([descriptor]);
            if (result.message) {
                await app.showAlert(result.message);
                return;
            }


            // Create new layer with blendmode SoftLight
            // layer = await document.backgroundLayer!.duplicate(undefined, BeautyPanel.getLayerName(E_Layer.DodgeAndBurnGray));
            layer = document.activeLayers[0];
            layer.blendMode = 'softLight';

        }

        // Select brush to start painting
        selectTool('paintbrushTool');

    } catch (err) {
        const message = err.message || err;
        app.showAlert(message);
    }
}

async function onBrushButtonClicked(e: React.MouseEvent<HTMLButtonElement>) {
    try {
        await selectTool('paintbrushTool');
    } catch (err) {
        const message = err.message || err;
        app.showAlert(message);
    }

}
async function onStampButtonClicked(e: React.MouseEvent<HTMLButtonElement>) {
    try {
        await selectTool('cloneStampTool');
    } catch (err) {
        const message = err.message || err;
        await app.showAlert(message);
    }
}

async function addCurvedAdjustmentLayer(sourceLayer: Layer, name: string, curve: Array<number[]>): Promise<Layer> {

    const layer = await sourceLayer.duplicate(undefined, name);

    const result = await app.batchPlay([
        {
            _obj: 'select',
            _target: {
                _ref: 'layer',
                _id: layer._id
            }
        },
        {
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
        }
    ], {});

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