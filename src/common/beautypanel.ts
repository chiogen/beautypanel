import { app, Layer } from "photoshop";
import { layerNames } from "./layer-names";

export enum E_Layer {
    // Frequency Separation
    Soft = 'soft',
    Detail = 'detail',
    Levels = 'levels',
    // Dodge and Burn
    Bright = 'bright',
    Dark = 'dark',
    DodgeAndBurnGray = 'dodgeAndBurnGray',
    // 
    DetailBlackWhite = 'detailBlackWhite',
    DetailColor = 'detailColor',
    DetailEnhance = 'detailEnhance',
    EnhanceDetails = 'enhanceDetails',
    // Effects
    Orton = 'orton',
    Vignette = 'vignette',
    Autumn = 'autumn'
}

export namespace BeautyPanel {

    export const layers = {
        get soft() {
            return getLayerByCode(E_Layer.Soft);
        },
        get detail() {
            return getLayerByCode(E_Layer.Detail);
        },
        get detailBlackWhite() {
            return getLayerByCode(E_Layer.DetailBlackWhite);
        },
        get detailColor() {
            return getLayerByCode(E_Layer.DetailColor);
        },
        get detailEnhance() {
            return getLayerByCode(E_Layer.DetailEnhance);
        },
        get levels() {
            return getLayerByCode(E_Layer.Levels);
        },
        get enhanceDetails() {
            return getLayerByCode(E_Layer.EnhanceDetails);
        },
        get dodgeAndBurnGray() {
            return getLayerByCode(E_Layer.DodgeAndBurnGray);
        },
        get orton() {
            return getLayerByCode(E_Layer.Orton);
        },
        get vignette() {
            return getLayerByCode(E_Layer.Vignette);
        },
        get dark() {
            return getLayerByCode(E_Layer.Dark);
        },
        get bright() {
            return getLayerByCode(E_Layer.Bright);
        },
        get autumn() {
            return getLayerByCode(E_Layer.Autumn);
        }
    }

    export function getLayerName(code: E_Layer): string {
        return layerNames[code];
    }

    function getLayerByCode(code: E_Layer): Layer | undefined {
        const name = getLayerName(code);;
        return app.activeDocument.layers.find(layer => layer.name.toLowerCase() === name.toLowerCase());
    }

}