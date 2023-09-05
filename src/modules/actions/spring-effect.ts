import { app, constants } from 'photoshop';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { BeautyPanel } from '../../common/beautypanel';
import { checkDescriptorErrors } from '../../common/errors/handle-error';

/**
 * Copied/Inspired by https://youtu.be/9OBCdj_8Fbw
 */
export async function createSpringEffect() {

    const document = app.activeDocument;
    if (!document)
        throw new Error('No document active');

    const adjustment = await createAdjustmentLayer();
    const levels = await createLevelsLayer();
    const contrast = await createContrastLayer();
    const photoFilter = await createPhotoFilter();
    const solidColor = await createSolidColorLayer();

    const group = await document.groupLayers([
        adjustment,
        levels,
        contrast,
        photoFilter,
        solidColor
    ]);

    if (!group)
        throw new Error('groupLayers didnt return a new layer.');

    group.name = BeautyPanel.layerNames.spring;

}

async function createAdjustmentLayer() {

    const results = await app.batchPlay(_createAdjustmentLayer(), {});
    checkDescriptorErrors(results)

    const adjustmentLayer = app.activeDocument.activeLayers[0];
    if (!adjustmentLayer)
        throw new Error('No active layer after creating adjustmentLayer');

    return adjustmentLayer;
}
function _createAdjustmentLayer(): ActionDescriptor[] {
    return [
        {
            "_obj": "make",
            "_target": [
                {
                    "_ref": "adjustmentLayer"
                }
            ],
            "using": {
                "_obj": "adjustmentLayer",
                "type": {
                    "_obj": "hueSaturation",
                    "presetKind": {
                        "_enum": "presetKindType",
                        "_value": "presetKindDefault"
                    },
                    "colorize": false
                }
            },
        },
        {
            "_obj": "set",
            "_target": [
                {
                    "_ref": "adjustmentLayer",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                }
            ],
            "to": {
                "_obj": "hueSaturation",
                "presetKind": {
                    "_enum": "presetKindType",
                    "_value": "presetKindCustom"
                },
                "adjustment": [
                    {
                        "_obj": "hueSatAdjustmentV2",
                        "hue": 0,
                        "saturation": 30,
                        "lightness": 0
                    }
                ]
            },
        },
        {
            "_obj": "set",
            "_target": [
                {
                    "_ref": "adjustmentLayer",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                }
            ],
            "to": {
                "_obj": "hueSaturation",
                "adjustment": [
                    {
                        "_obj": "hueSatAdjustmentV2",
                        "localRange": 1,
                        "beginRamp": 315,
                        "beginSustain": 345,
                        "endSustain": 15,
                        "endRamp": 45,
                        "hue": 0,
                        "saturation": -26,
                        "lightness": 0
                    }
                ]
            },
        },
        {
            "_obj": "set",
            "_target": [
                {
                    "_ref": "adjustmentLayer",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                }
            ],
            "to": {
                "_obj": "hueSaturation",
                "adjustment": [
                    {
                        "_obj": "hueSatAdjustmentV2",
                        "localRange": 2,
                        "beginRamp": 15,
                        "beginSustain": 45,
                        "endSustain": 75,
                        "endRamp": 105,
                        "hue": 16,
                        "saturation": 0,
                        "lightness": 0
                    }
                ]
            }
        },
        {
            "_obj": "set",
            "_target": [
                {
                    "_ref": "adjustmentLayer",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                }
            ],
            "to": {
                "_obj": "hueSaturation",
                "adjustment": [
                    {
                        "_obj": "hueSatAdjustmentV2",
                        "localRange": 3,
                        "beginRamp": 75,
                        "beginSustain": 105,
                        "endSustain": 135,
                        "endRamp": 165,
                        "hue": 0,
                        "saturation": -13,
                        "lightness": 0
                    }
                ]
            }
        }
    ]
}

async function createLevelsLayer() {

    const results = await app.batchPlay(_createLevelsLayer(), {});
    checkDescriptorErrors(results)

    const levelsLayer = app.activeDocument.activeLayers[0];
    if (!levelsLayer)
        throw new Error('No active layer after creating levels layer');

    levelsLayer.blendMode = constants.BlendMode.SCREEN;
    levelsLayer.opacity = 0.4;

    return levelsLayer;
}
function _createLevelsLayer() {
    return [
        {
            "_obj": "make",
            "_target": [
                {
                    "_ref": "adjustmentLayer"
                }
            ],
            "using": {
                "_obj": "adjustmentLayer",
                "type": {
                    "_obj": "levels",
                    "presetKind": {
                        "_enum": "presetKindType",
                        "_value": "presetKindDefault"
                    }
                }
            },
        },
        {
            "_obj": "set",
            "_target": [
                {
                    "_ref": "adjustmentLayer",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                }
            ],
            "to": {
                "_obj": "levels",
                "presetKind": {
                    "_enum": "presetKindType",
                    "_value": "presetKindCustom"
                },
                "adjustment": [
                    {
                        "_obj": "levelsAdjustment",
                        "channel": {
                            "_ref": "channel",
                            "_enum": "channel",
                            "_value": "composite"
                        },
                        "output": [
                            19,
                            255
                        ]
                    }
                ]
            },
        },
        {
            "_obj": "set",
            "_target": [
                {
                    "_ref": "adjustmentLayer",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                }
            ],
            "to": {
                "_obj": "levels",
                "adjustment": [
                    {
                        "_obj": "levelsAdjustment",
                        "channel": {
                            "_ref": "channel",
                            "_enum": "channel",
                            "_value": "blue"
                        },
                        "output": [
                            29,
                            232
                        ]
                    }
                ]
            },
        },
        {
            "_obj": "set",
            "_target": [
                {
                    "_ref": "adjustmentLayer",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                }
            ],
            "to": {
                "_obj": "levels",
                "adjustment": [
                    {
                        "_obj": "levelsAdjustment",
                        "channel": {
                            "_ref": "channel",
                            "_enum": "channel",
                            "_value": "composite"
                        },
                        "gamma": 1.14
                    }
                ]
            },
        }
    ]
}

async function createContrastLayer() {

    const results = await app.batchPlay(_createContrastLayer(), {});
    checkDescriptorErrors(results)

    const contrastLayer = app.activeDocument.activeLayers[0];
    if (!contrastLayer)
        throw new Error('No active layer after creating contrast layer');

    contrastLayer.opacity = 0.5;

    return contrastLayer;
}
function _createContrastLayer() {
    return [
        {
            "_obj": "make",
            "_target": [
                {
                    "_ref": "adjustmentLayer"
                }
            ],
            "using": {
                "_obj": "adjustmentLayer",
                "type": {
                    "_obj": "brightnessEvent",
                    "useLegacy": false
                }
            },
        },
        {
            "_obj": "set",
            "_target": [
                {
                    "_ref": "adjustmentLayer",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                }
            ],
            "to": {
                "_obj": "brightnessEvent",
                "brightness": 0,
                "center": 55,
                "useLegacy": false
            },
        }
    ]
}

async function createPhotoFilter() {

    const results = await app.batchPlay(_createPhotoFilter(), {});
    checkDescriptorErrors(results)

    const photoFilter = app.activeDocument.activeLayers[0];
    if (!photoFilter)
        throw new Error('No active layer after creating photo filter layer');

    photoFilter.opacity = 0.15;

    return photoFilter;
}
function _createPhotoFilter() {
    return [
        {
            "_obj": "make",
            "_target": [
                {
                    "_ref": "adjustmentLayer"
                }
            ],
            "using": {
                "_obj": "adjustmentLayer",
                "type": {
                    "_obj": "photoFilter",
                    "color": {
                        "_obj": "labColor",
                        "luminance": 67.06,
                        "a": 32,
                        "b": 120
                    },
                    "density": 25,
                    "preserveLuminosity": true
                }
            },
        },
        {
            "_obj": "set",
            "_target": [
                {
                    "_ref": "adjustmentLayer",
                    "_enum": "ordinal",
                    "_value": "targetEnum"
                }
            ],
            "to": {
                "_obj": "photoFilter",
                "density": 40
            },
        }
    ];
}

async function createSolidColorLayer() {

    const results = await app.batchPlay(_createSolidColorLayer(), {});
    checkDescriptorErrors(results)

    const solidColorLayer = app.activeDocument.activeLayers[0];
    if (!solidColorLayer)
        throw new Error('No active layer after creating photo filter layer');

    solidColorLayer.blendMode = constants.BlendMode.SOFTLIGHT;
    solidColorLayer.opacity = 0.15;

    return solidColorLayer;
}
function _createSolidColorLayer() {
    return [
        {
            "_obj": "make",
            "_target": [
                {
                    "_ref": "contentLayer"
                }
            ],
            "using": {
                "_obj": "contentLayer",
                "type": {
                    "_obj": "solidColorLayer",
                    "color": {
                        "_obj": "RGBColor",
                        "red": 237.99636840820312,
                        "grain": 185.99716186523438,
                        "blue": 247.9962158203125
                    }
                }
            },
        }
    ];
}