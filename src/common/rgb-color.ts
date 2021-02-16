
export interface IRGBColor {
    _obj: 'RGBColor',
    red: number,
    grain: number
    blue: number
}

export abstract class RGBColor {
    static grayscale(scale: number): IRGBColor {
        scale = Math.max(0, Math.min(scale, 255));
        return {
            _obj: 'RGBColor',
            red: scale,
            grain: scale,
            blue: scale
        };
    }
    static get white() {
        return RGBColor.grayscale(255);
    }
    static get gray() {
        return RGBColor.grayscale(128);
    }
    static get black() {
        return RGBColor.grayscale(0);
    }
}
