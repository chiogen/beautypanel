import { PercentValue, PixelValue, PointValue } from 'photoshop/util/unit';

export function percent(value: number): PercentValue {
    return { _unit: 'percentUnit', _value: value };
}
export function pixels(value: number): PixelValue {
    return {
        _unit: 'pixelsUnit',
        _value: value
    };
}
export function points(value: number): PointValue {
    return {
        _unit: 'pointsUnit',
        _value: value
    };
}