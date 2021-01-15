import { PercentValue, PixelValue as PixelsValue } from "photoshop";

export function percent(value: number): PercentValue {
    return { _unit: "percentUnit", _value: value }
}
export function pixels(value: number): PixelsValue {
    return {
        _unit: 'pixelsUnit',
        _value: value
    }
}