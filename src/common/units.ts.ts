import { PercentValue, PixelValue as PixelsValue, PointsValue } from "photoshop";

export function percent(value: number): PercentValue {
    return { _unit: "percentUnit", _value: value }
}
export function pixels(value: number): PixelsValue {
    return {
        _unit: 'pixelsUnit',
        _value: value
    }
}
export function points(value: number): PointsValue {
    return {
        _unit: 'pointsUnit',
        _value: value
    }
}