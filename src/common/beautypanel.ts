import i18next from "i18next";
import { app, Layer } from "photoshop";

export enum E_Layer {
    // Frequency Separation
    Soft = 'soft',
    Detail = 'detail',
    Contrast = 'contrast',
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
    Autumn = 'autumn',
    Spring = 'sring'
}

export namespace BeautyPanel {

    export const layers = {
        get soft() {
            return getLayerByCode(E_Layer.Soft);
        },
        get detail() {
            return getLayerByCode(E_Layer.Detail);
        },
        get contrast() {
            return getLayerByCode(E_Layer.Contrast);
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
        return i18next.t('layerNames.' + code) as string;
    }

    function getLayerByCode(code: E_Layer): Layer | undefined {
        const name = getLayerName(code);
        return app.activeDocument?.layers.find(layer => layer.name.toLowerCase() === name.toLowerCase());
    }

}