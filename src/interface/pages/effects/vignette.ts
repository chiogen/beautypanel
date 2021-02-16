import { ActionDescriptor, app, Document, Layer } from "photoshop";
import { BeautyPanel, E_Layer } from "../../../common/beautypanel";
import { DocumentUtils } from "../../../common/document-utils";
import { LayerUtils } from "../../../common/layer-utils";
import { percent, pixels, points } from "../../../common/units";

export enum VignetteType {
    Circle = 'circle',
    Elipse = 'elipse'
}

/**
 * Create a simle vignette using https://helpx.adobe.com/de/photoshop/how-to/create-vignette-with-layer-mask.html
 */
export async function createVignette(e: React.MouseEvent<HTMLButtonElement>) {

    if (!app.activeDocument)
        return;

    try {

        const document = app.activeDocument;
        await DocumentUtils.checkBitsPerChannel(document);
        
        const referenceLayer = document.backgroundLayer ?? document.layers[0];
        referenceLayer.visible = true;

        // Options
        let layer = BeautyPanel.layers.vignette;

        // Delete existing layer
        if (layer) {
            layer.delete();
            layer = undefined;
        }

        layer = await createVignetteArtLayer(document, VignetteType.Elipse, 100);
        layer.name = BeautyPanel.getLayerName(E_Layer.Vignette);

    } catch (err) {
        const message = err.message || err;
        await app.showAlert(message);
    }
}

async function createVignetteArtLayer(document: Document, type: VignetteType, padding: number): Promise<Layer> {

    const width = document.width;
    const height = document.height;

    let top = padding;
    let left = padding;
    let right = width - padding;
    let bottom = height - padding;

    const createVignetteLayer: ActionDescriptor = {
        _obj: "make",
        _target: [
            {
                _ref: "contentLayer"
            }
        ],
        using: {
            _obj: "contentLayer",
            type: {
                _obj: "solidColorLayer",
                color: {
                    _obj: "RGBColor",
                    red: 105.99838256835938,
                    grain: 119.9981689453125,
                    blue: 131.00189208984375
                }
            },
            shape: {
                _obj: "rectangle",
                unitValueQuadVersion: 1,
                top: pixels(top),
                left: pixels(left),
                bottom: pixels(bottom),
                right: pixels(right),
                topRight: pixels(0),
                topLeft: pixels(0),
                bottomLeft: pixels(0),
                bottomRight: pixels(0)
            },
            strokeStyle: {
                _obj: "strokeStyle",
                strokeStyleVersion: 2,
                strokeEnabled: true,
                fillEnabled: true,
                strokeStyleLineWidth: pixels(1),
                strokeStyleLineDashOffset: points(0),
                strokeStyleMiterLimit: 100,
                strokeStyleLineCapType: {
                    _enum: "strokeStyleLineCapType",
                    _value: "strokeStyleButtCap"
                },
                strokeStyleLineJoinType: {
                    _enum: "strokeStyleLineJoinType",
                    _value: "strokeStyleMiterJoin"
                },
                strokeStyleLineAlignment: {
                    _enum: "strokeStyleLineAlignment",
                    _value: "strokeStyleAlignCenter"
                },
                strokeStyleScaleLock: false,
                strokeStyleStrokeAdjust: false,
                strokeStyleLineDashSet: [],
                strokeStyleBlendMode: {
                    _enum: "blendMode",
                    _value: "normal"
                },
                strokeStyleOpacity: percent(100),
                strokeStyleContent: {
                    _obj: "solidColorLayer",
                    color: {
                        _obj: "RGBColor",
                        red: 0,
                        grain: 0,
                        blue: 0
                    }
                },
                strokeStyleResolution: 72
            }
        }
    };
    const subtractForm: ActionDescriptor = {
        _obj: "changePathDetails",
        keyOriginType: 3,
        keyOriginResolution: 72,
        keyActionMode: 1
    };
    const createMask: ActionDescriptor = {
        _obj: 'set',
        _target: [
            {
                _ref: "layer",
                _enum: "ordinal",
                _value: "targetEnum"
            }
        ],
        to: {
            _obj: "layer",
            vectorMaskFeather: {
                _unit: "pixelsUnit",
                _value: 126.1
            }
        }
    };
    const setColor: ActionDescriptor = {
        _obj: 'set',
        _target: [
            {
                _ref: "contentLayer",
                _enum: "ordinal",
                _value: "targetEnum"
            }
        ],
        to: {
            _obj: "shapeStyle",
            fillContents: {
                _obj: "solidColorLayer",
                color: {
                    _obj: "RGBColor",
                    red: 0,
                    grain: 0,
                    blue: 0
                }
            },
            strokeStyle: {
                _obj: "strokeStyle",
                strokeStyleVersion: 2,
                fillEnabled: true
            }
        }
    }
    const deselectForm: ActionDescriptor = {
        _obj: "deselect",
        _target: [
            {
                _ref: "path",
                _enum: "ordinal",
                _value: "targetEnum"
            }
        ]
    };

    const result = await app.batchPlay([
        createVignetteLayer,
        subtractForm,
        createMask,
        setColor,
        deselectForm
    ], {});

    for (const item of result) {
        if (item.message) {
            await app.showAlert(item.message);
        }
    }

    return document.activeLayers[0];
}
async function createElipse() {

}