import * as React from 'react'
import i18next from "i18next";
import { app, Layer } from 'photoshop';
import { BeautyPanel, E_Layer } from '../../../common/beautypanel';
import { DocumentUtils } from '../../../common/document-utils';
import { LayerUtils } from '../../../common/layer-utils';
import { selectTool, setForegroundColor } from '../../../common/app-utils';
import { confirm } from '../../dialogues/confirm';
import { StatefulComponent } from '../../../components/base/stateful-component';
import { store, TState } from '../../../store';
import { property } from '../../../decorators/react-property';
import { percent } from '../../../common/units';

interface State {
    currentTool: string,
    color: string
}

export class DodgeAndBurn extends StatefulComponent<{}, State> {

    @property
    currentTool: string

    @property
    color: string

    constructor(props: {}) {
        super(props);
        const state = store.getState();
        this.state = {
            currentTool: state.currentTool,
            color: 'gray'
        };
    }

    render() {

        const white: React.CSSProperties = {
            backgroundColor: 'white',
            color: 'black'
        };
        const gray: React.CSSProperties = {
            backgroundColor: 'gray',
            color: 'white'
        };
        const black: React.CSSProperties = {
            backgroundColor: 'black',
            color: 'white'
        };

        switch (this.color) {
            case 'white':
                white.outline = '2px solid red';
                break;
            case 'gray':
                gray.outline = '2px solid red';
                break;
            case 'black':
                black.outline = '2px solid red';
                break;
        }

        // Event functions
        const setColor = this.setColor.bind(this);

        return (
            <div className="section">
                <h3 className="title">Dodge and Burn</h3>
                <div id="dodge-and-burn">
                    <div className="flex-buttons">
                        <sp-action-button onClick={this.excecuteWithGradient.bind(this)}>{i18next.t('dodgeAndBurn.gradient')}</sp-action-button>
                        <sp-action-button onClick={this.execute.bind(this)}>{i18next.t('dodgeAndBurn.default')}</sp-action-button>
                    </div>
                    <div className="flex-buttons">
                        <sp-action-button data-color="white" style={white} onClick={setColor}>{i18next.t('dodgeAndBurn.white')}</sp-action-button>
                        <sp-action-button data-color="gray" style={gray} onClick={setColor}>{i18next.t('dodgeAndBurn.gray')}</sp-action-button>
                        <sp-action-button data-color="black" style={black} onClick={setColor}>{i18next.t('dodgeAndBurn.black')}</sp-action-button>
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

    private async execute(_e: React.MouseEvent<HTMLButtonElement>) {

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

                layer = await DocumentUtils.createNewLayer(BeautyPanel.getLayerName(E_Layer.DodgeAndBurn));
                layer.blendMode = 'softLight';

                const topLayer = document.layers[0];
                if (topLayer === document.backgroundLayer || topLayer !== layer) {
                    layer.moveAbove(topLayer)
                }

            }

            // Select brush to start painting
            await selectTool('bucketTool');
            await setForegroundColor(128);

            const _fill = {
                _obj: 'fill',
                from: {
                   _obj: "paint",
                    horizontal: percent(50),
                    vertical: percent(50)
                },
                tolerance: 100,
                antiAlias: true,
                using: {
                    _enum: "fillContents",
                    _value: "foregroundColor"
                },
                opacity: percent(50)
            }
            const [fillResult] = await app.batchPlay([_fill]);
            if (fillResult.message) {
                throw new Error(fillResult.message)
            }

            await selectTool('paintbrushTool');

            this.color = 'white';
            await setForegroundColor(255, 255, 255);

        } catch (err) {
            const message = err.message || err;
            app.showAlert(message);
        }

    }

    private async excecuteWithGradient(_e: React.MouseEvent<HTMLButtonElement>) {

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

    private async setColor(e: React.MouseEvent<HTMLButtonElement>) {
        try {

            const layer = BeautyPanel.layers.dodgeAndBurnGray;
            if (!layer) {
                throw new Error('You must run Dodge&Burn first.')
            }

            const button = e.target as HTMLButtonElement;
            const colorCode = button.dataset.color;
            if (colorCode) {
                this.color = colorCode;

                let grayscale = 128;
                if (this.color === 'white') {
                    grayscale = 255;
                } else if (this.color === 'black') {
                    grayscale = 0;
                }

                await selectTool('paintbrushTool');
                await setForegroundColor(grayscale);

                layer.visible = true;
                await DocumentUtils.selectLayers([layer])
            }
        } catch (err) {
            await app.showAlert(err);
        }
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