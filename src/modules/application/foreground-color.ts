import { app } from "photoshop";
import { IRGBColor } from "../../common/rgb-color";


export async function setForegroundColor(r: number, g: number = r, b: number = r) {
    const [result] = await app.batchPlay([
        _setForegroundColor(r, g, b)
    ]);

    if (result.message) {
        throw new Error(result.message);
    }
}
export function _setForegroundColor(r: number, g: number = r, b: number = r) {
    return {
        _obj: "set",
        _target: [
            {
                _ref: "color",
                _property: "foregroundColor"
            }
        ],
        to: {
            _obj: 'RGBColor',
            red: r,
            blue: b,
            grain: g
        } as IRGBColor,
        source: "photoshopPicker"
    }
}