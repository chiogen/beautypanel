import { PercentValue } from "photoshop";

export function percent(value: number): PercentValue {
    return { _unit: "percentUnit", _value: value }
}