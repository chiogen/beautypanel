import i18next from 'i18next';
import { app } from 'photoshop';
import { BeautyPanel } from '../../common/beautypanel';
import { selectTool } from '../application/select-tool';
import { selectLayers } from '../image/select-layers';
import { moveLayerToTop } from '../layer/move-layer-to-top';
import { ActionDescriptor } from 'photoshop/dom/CoreModules';
import { checkDescriptorErrors } from '../../common/errors/handle-error';

export async function insertCopyright(text: string) {

    const document = app.activeDocument;
    if (!document) {
        throw new Error(i18next.t('errors.noDocumentActive'));
    }

    if (BeautyPanel.layers.copyright) {
        return;
    }

    await switchToDetailLayer();

    const results = await app.batchPlay(_createTextLayer(text), {});
    checkDescriptorErrors(results);

    const copyrightLayer = document.activeLayers[0];
    if (!copyrightLayer)
        throw new Error('Creating TextLayer error failed');

    copyrightLayer.name = BeautyPanel.layerNames.copyright;
    copyrightLayer.opacity = 82;

    moveLayerToTop(copyrightLayer);

    await selectTool('moveTool');

    // throw new Error('[insertCopyright] Not implemented');
}

async function switchToDetailLayer() {
    const detail = BeautyPanel.layers.detail;

    if (detail) {
        await selectLayers([detail]);
    }
}

function _createTextLayer(text: string): ActionDescriptor[] {
    return [
        {
            _obj: 'make',
            _target: [
                {
                    _ref: 'textLayer'
                }
            ],
            using: {
                _obj: 'textLayer',
                textKey: text,
                warp: {
                    _obj: 'warp',
                    warpStyle: {
                        _enum: 'warpStyle',
                        _value: 'warpNone'
                    },
                    warpValue: 0,
                    warpPerspective: 0,
                    warpPerspectiveOther: 0,
                    warpRotate: {
                        _enum: 'orientation',
                        _value: 'horizontal'
                    }
                },
                textClickPoint: {
                    _obj: 'point',
                    horizontal: {
                        _unit: 'percentUnit',
                        _value: 41.90210903302825
                    },
                    vertical: {
                        _unit: 'percentUnit',
                        _value: 61.25373134328358
                    }
                },
                textGridding: {
                    _enum: 'textGridding',
                    _value: 'none'
                },
                orientation: {
                    _enum: 'orientation',
                    _value: 'horizontal'
                },
                antiAlias: {
                    _enum: 'antiAliasType',
                    _value: 'antiAliasSharp'
                },
                bounds: {
                    _obj: 'bounds',
                    left: {
                        _unit: 'pointsUnit',
                        _value: 0
                    },
                    top: {
                        _unit: 'pointsUnit',
                        _value: -17.2705078125
                    },
                    right: {
                        _unit: 'pointsUnit',
                        _value: 153.7774658203125
                    },
                    bottom: {
                        _unit: 'pointsUnit',
                        _value: 8.37890625
                    }
                },
                boundingBox: {
                    _obj: 'boundingBox',
                    left: {
                        _unit: 'pointsUnit',
                        _value: 0
                    },
                    top: {
                        _unit: 'pointsUnit',
                        _value: -16
                    },
                    right: {
                        _unit: 'pointsUnit',
                        _value: 154.09765625
                    },
                    bottom: {
                        _unit: 'pointsUnit',
                        _value: 0
                    }
                },
                textShape: [
                    {
                        _obj: 'textShape',
                        char: {
                            _enum: 'char',
                            _value: 'point'
                        },
                        orientation: {
                            _enum: 'orientation',
                            _value: 'horizontal'
                        },
                        transform: {
                            _obj: 'transform',
                            xx: 1,
                            xy: 0,
                            yx: 0,
                            yy: 1,
                            tx: 0,
                            ty: 0
                        },
                        rowCount: 1,
                        columnCount: 1,
                        rowMajorOrder: true,
                        rowGutter: {
                            _unit: 'pointsUnit',
                            _value: 0
                        },
                        columnGutter: {
                            _unit: 'pointsUnit',
                            _value: 0
                        },
                        spacing: {
                            _unit: 'pointsUnit',
                            _value: 0
                        },
                        frameBaselineAlignment: {
                            _enum: 'frameBaselineAlignment',
                            _value: 'alignByAscent'
                        },
                        firstBaselineMinimum: {
                            _unit: 'pointsUnit',
                            _value: 0
                        },
                        base: {
                            _obj: 'point',
                            horizontal: 0,
                            vertical: 0
                        }
                    }
                ],
                textStyleRange: [
                    {
                        _obj: 'textStyleRange',
                        from: 0,
                        to: 15,
                        textStyle: {
                            _obj: 'textStyle',
                            styleSheetHasParent: true,
                            fontPostScriptName: 'Tahoma-Bold',
                            fontName: 'Tahoma',
                            fontStyleName: 'Bold',
                            fontScript: 0,
                            fontTechnology: 1,
                            size: {
                                _unit: 'pointsUnit',
                                _value: 20
                            },
                            impliedFontSize: {
                                _unit: 'pointsUnit',
                                _value: 20
                            },
                            horizontalScale: 100,
                            verticalScale: 100,
                            syntheticBold: false,
                            syntheticItalic: false,
                            autoLeading: true,
                            tracking: 0,
                            baselineShift: {
                                _unit: 'pointsUnit',
                                _value: 0
                            },
                            impliedBaselineShift: {
                                _unit: 'pointsUnit',
                                _value: 0
                            },
                            autoKern: {
                                _enum: 'autoKern',
                                _value: 'metricsKern'
                            },
                            fontCaps: {
                                _enum: 'fontCaps',
                                _value: 'normal'
                            },
                            digitSet: {
                                _enum: 'digitSet',
                                _value: 'defaultDigits'
                            },
                            kashidas: {
                                _enum: 'kashidas',
                                _value: 'kashidaDefault'
                            },
                            diacXOffset: {
                                _unit: 'pointsUnit',
                                _value: 0
                            },
                            diacYOffset: {
                                _unit: 'pointsUnit',
                                _value: 0
                            },
                            markYDistFromBaseline: {
                                _unit: 'pointsUnit',
                                _value: 100
                            },
                            baseline: {
                                _enum: 'baseline',
                                _value: 'normal'
                            },
                            strikethrough: {
                                _enum: 'strikethrough',
                                _value: 'strikethroughOff'
                            },
                            underline: {
                                _enum: 'underline',
                                _value: 'underlineOff'
                            },
                            ligature: true,
                            altligature: false,
                            contextualLigatures: false,
                            fractions: false,
                            ordinals: false,
                            swash: false,
                            titling: false,
                            connectionForms: false,
                            stylisticAlternates: false,
                            ornaments: false,
                            justificationAlternates: false,
                            figureStyle: {
                                _enum: 'figureStyle',
                                _value: 'normal'
                            },
                            proportionalMetrics: false,
                            kana: false,
                            italics: false,
                            baselineDirection: {
                                _enum: 'baselineDirection',
                                _value: 'withStream'
                            },
                            textLanguage: {
                                _enum: 'textLanguage',
                                _value: 'oldGermanLanguage'
                            },
                            japaneseAlternate: {
                                _enum: 'japaneseAlternate',
                                _value: 'defaultForm'
                            },
                            mojiZume: 0,
                            gridAlignment: {
                                _enum: 'gridAlignment',
                                _value: 'roman'
                            },
                            noBreak: false,
                            color: {
                                _obj: 'RGBColor',
                                red: 255,
                                green: 255,
                                blue: 255
                            },
                            strokeColor: {
                                _obj: 'RGBColor',
                                red: 0,
                                green: 0,
                                blue: 0
                            },
                            baseParentStyle: {
                                _obj: 'textStyle',
                                fontPostScriptName: 'MyriadPro-Regular',
                                fontName: 'Myriad Pro',
                                fontStyleName: 'Regular',
                                fontScript: 0,
                                fontTechnology: 0,
                                size: {
                                    _unit: 'pointsUnit',
                                    _value: 12
                                },
                                impliedFontSize: {
                                    _unit: 'pointsUnit',
                                    _value: 12
                                },
                                horizontalScale: 100,
                                verticalScale: 100,
                                syntheticBold: false,
                                syntheticItalic: false,
                                autoLeading: true,
                                tracking: 0,
                                baselineShift: {
                                    _unit: 'pointsUnit',
                                    _value: 0
                                },
                                impliedBaselineShift: {
                                    _unit: 'pointsUnit',
                                    _value: 0
                                },
                                characterRotation: 0,
                                autoKern: {
                                    _enum: 'autoKern',
                                    _value: 'metricsKern'
                                },
                                fontCaps: {
                                    _enum: 'fontCaps',
                                    _value: 'normal'
                                },
                                digitSet: {
                                    _enum: 'digitSet',
                                    _value: 'defaultDigits'
                                },
                                dirOverride: {
                                    _enum: 'dirOverride',
                                    _value: 'dirOverrideDefault'
                                },
                                kashidas: {
                                    _enum: 'kashidas',
                                    _value: 'kashidaDefault'
                                },
                                diacVPos: {
                                    _enum: 'diacVPos',
                                    _value: 'diacVPosOpenType'
                                },
                                diacXOffset: {
                                    _unit: 'pointsUnit',
                                    _value: 0
                                },
                                diacYOffset: {
                                    _unit: 'pointsUnit',
                                    _value: 0
                                },
                                markYDistFromBaseline: {
                                    _unit: 'pointsUnit',
                                    _value: 100
                                },
                                baseline: {
                                    _enum: 'baseline',
                                    _value: 'normal'
                                },
                                otbaseline: {
                                    _enum: 'otbaseline',
                                    _value: 'normal'
                                },
                                strikethrough: {
                                    _enum: 'strikethrough',
                                    _value: 'strikethroughOff'
                                },
                                underline: {
                                    _enum: 'underline',
                                    _value: 'underlineOff'
                                },
                                underlineOffset: {
                                    _unit: 'pointsUnit',
                                    _value: 0
                                },
                                ligature: true,
                                altligature: false,
                                contextualLigatures: false,
                                alternateLigatures: false,
                                oldStyle: false,
                                fractions: false,
                                ordinals: false,
                                swash: false,
                                titling: false,
                                connectionForms: false,
                                stylisticAlternates: false,
                                ornaments: false,
                                justificationAlternates: false,
                                figureStyle: {
                                    _enum: 'figureStyle',
                                    _value: 'normal'
                                },
                                proportionalMetrics: false,
                                kana: false,
                                italics: false,
                                ruby: false,
                                baselineDirection: {
                                    _enum: 'baselineDirection',
                                    _value: 'rotated'
                                },
                                textLanguage: {
                                    _enum: 'textLanguage',
                                    _value: 'englishLanguage'
                                },
                                japaneseAlternate: {
                                    _enum: 'japaneseAlternate',
                                    _value: 'defaultForm'
                                },
                                mojiZume: 0,
                                gridAlignment: {
                                    _enum: 'gridAlignment',
                                    _value: 'roman'
                                },
                                enableWariChu: false,
                                wariChuCount: 2,
                                wariChuLineGap: 0,
                                wariChuScale: 0.5,
                                wariChuWidow: 2,
                                wariChuOrphan: 2,
                                wariChuJustification: {
                                    _enum: 'wariChuJustification',
                                    _value: 'wariChuAutoJustify'
                                },
                                tcyUpDown: 0,
                                tcyLeftRight: 0,
                                leftAki: -1,
                                rightAki: -1,
                                jiDori: 0,
                                noBreak: false,
                                color: {
                                    _obj: 'RGBColor',
                                    red: 0,
                                    green: 0,
                                    blue: 0
                                },
                                strokeColor: {
                                    _obj: 'RGBColor',
                                    red: 0,
                                    green: 0,
                                    blue: 0
                                },
                                fill: true,
                                stroke: false,
                                fillFirst: true,
                                fillOverPrint: false,
                                strokeOverPrint: false,
                                lineCap: {
                                    _enum: 'lineCap',
                                    _value: 'buttCap'
                                },
                                lineJoin: {
                                    _enum: 'lineJoin',
                                    _value: 'miterJoin'
                                },
                                lineWidth: {
                                    _unit: 'pointsUnit',
                                    _value: 1
                                },
                                miterLimit: {
                                    _unit: 'pointsUnit',
                                    _value: 4
                                },
                                lineDashoffset: 0
                            }
                        }
                    }
                ],
                paragraphStyleRange: [
                    {
                        _obj: 'paragraphStyleRange',
                        from: 0,
                        to: 15,
                        paragraphStyle: {
                            _obj: 'paragraphStyle',
                            styleSheetHasParent: true,
                            burasagari: {
                                _enum: 'burasagari',
                                _value: 'burasagariStandard'
                            },
                            textEveryLineComposer: true,
                            textComposerEngine: {
                                _enum: 'textComposerEngine',
                                _value: 'textLatinCJKComposer'
                            }
                        }
                    }
                ],
                kerningRange: []
            },
        },
        {
            _obj: 'set',
            _target: [
                {
                    _ref: 'property',
                    _property: 'layerEffects'
                },
                {
                    _ref: 'layer',
                    _enum: 'ordinal',
                    _value: 'targetEnum'
                }
            ],
            to: {
                _obj: 'layerEffects',
                globalLightingAngle: {
                    _unit: 'angleUnit',
                    _value: 138
                },
                scale: {
                    _unit: 'percentUnit',
                    _value: 416.6666666666667
                },
                dropShadow: {
                    _obj: 'dropShadow',
                    enabled: true,
                    mode: {
                        _enum: 'blendMode',
                        _value: 'normal'
                    },
                    color: {
                        _obj: 'RGBColor',
                        red: 0,
                        green: 0,
                        blue: 0
                    },
                    opacity: {
                        _unit: 'percentUnit',
                        _value: 75
                    },
                    useGlobalAngle: true,
                    localLightingAngle: {
                        _unit: 'angleUnit',
                        _value: 120
                    },
                    distance: {
                        _unit: 'pixelsUnit',
                        _value: 5
                    },
                    chokeMatte: {
                        _unit: 'pixelsUnit',
                        _value: 9
                    },
                    blur: {
                        _unit: 'pixelsUnit',
                        _value: 13
                    },
                    noise: {
                        _unit: 'percentUnit',
                        _value: 0
                    },
                    antiAlias: false,
                    transferSpec: {
                        _obj: 'shapeCurveType',
                        name: 'Linear'
                    },
                    layerConceals: true
                }
            }
        }
    ];
}