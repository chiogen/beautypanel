import i18next from 'i18next';
import { app } from 'photoshop';
import { Layer } from 'photoshop/dom/Layer';

export enum E_Layer {
    // Frequency Separation
    Soft = 'soft',
    Detail = 'detail',
    Contrast = 'contrast',
    // Dodge and Burn
    Bright = 'bright',
    Dark = 'dark',
    DodgeAndBurn = 'dodgeAndBurnGray',
    // 
    DetailBlackWhite = 'detailBlackWhite',
    DetailColor = 'detailColor',
    DetailEnhance = 'detailEnhance',
    EnhanceDetails = 'enhanceDetails',
    // Effects
    Orton = 'orton',
    Vignette = 'vignette',
    Autumn = 'autumn',
    Spring = 'spring',
    Copyright = 'copyright'
}

const layers = {
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
        return getLayerByCode(E_Layer.DodgeAndBurn);
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
    },
    get copyright() {
        return getLayerByCode(E_Layer.Copyright);
    }
};

const layerNames = {
    get soft() {
        return getLayerName(E_Layer.Soft);
    },
    get detail() {
        return getLayerName(E_Layer.Detail);
    },
    get contrast() {
        return getLayerName(E_Layer.Contrast);
    },
    get detailBlackWhite() {
        return getLayerName(E_Layer.DetailBlackWhite);
    },
    get detailColor() {
        return getLayerName(E_Layer.DetailColor);
    },
    get detailEnahnce() {
        return getLayerName(E_Layer.DetailEnhance);
    },
    get enhanceDetails() {
        return getLayerName(E_Layer.EnhanceDetails);
    },
    get dodgeAndBurnGray() {
        return getLayerName(E_Layer.DodgeAndBurn);
    },
    get orton() {
        return getLayerName(E_Layer.Orton);
    },
    get vignette() {
        return getLayerName(E_Layer.Vignette);
    },
    get dark() {
        return getLayerName(E_Layer.Dark);
    },
    get bright() {
        return getLayerName(E_Layer.Bright);
    },
    get autumn() {
        return getLayerName(E_Layer.Autumn);
    },
    get copyright() {
        return getLayerName(E_Layer.Copyright);
    }
};

function getLayerName(code: E_Layer): string {
    return i18next.t('layerNames.' + code) as string;
}
function getLayerByCode(code: E_Layer): Layer | null {
    const name = getLayerName(code);
    return getLayerByName(name);
}
function getLayerByName(name: string) {
    return app.activeDocument?.layers.find(layer => layer.name.toLowerCase() === name.toLowerCase()) ?? null;
}

export const BeautyPanel = {
    layers,
    layerNames,
    getLayerByName,
    getLayerByCode,
    getLayerName
};
