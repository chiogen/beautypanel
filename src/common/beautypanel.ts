import { app, Layer } from "photoshop";
import { layerNames } from "./layer-names";

export namespace BeautyPanel {

    export const layers = {
        get soft() {
            return getLayerByCode('soft');
        },
        get detail() {
            return getLayerByCode('detail');
        },
        get detailBlackWhite() {
            return getLayerByCode('detailBlackWhite');
        },
        get detailColor() {
            return getLayerByCode('detailColor');
        },
        get detailEnhance() {
            return getLayerByCode('detailEnhance');
        },
        get levels() {
            return getLayerByCode('levels');
        },
        get enhanceDetails() {
            return getLayerByCode('enhanceDetails');
        },
        get dodgeAndBurnGray() {
            return getLayerByCode('dodgeAndBurnGray');
        },
        get orton() {
            return getLayerByCode('orton');
        },
        get vignette() {
            return getLayerByCode('vignette');
        },
        get dark() {
            return getLayerByCode('dark');
        },
        get bright() {
            return getLayerByCode('bright');
        },
        get autumn() {
            return getLayerByCode('autumn');
        }
    }

    export function getLayerNameByCode(code: string): string {
        return layerNames[code];
    }

    function getLayerByCode(code: string): Layer | undefined {
        const name = getLayerNameByCode(code);;
        return app.activeDocument.layers.find(layer => layer.name.toLowerCase() === name.toLowerCase());
    }

}