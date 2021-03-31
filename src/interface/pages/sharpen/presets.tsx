import * as React from "react"
import i18next from "i18next";
import { Heading } from "@adobe/react-spectrum";
import { PresetsManager } from "../../../common/presets-manager";
import { app } from "photoshop";
import { filterUnsharpMask } from "../../../modules/filter/sharpen/unsharp-mask";
import { DialogOptions } from "../../../enums/dialog-options";

type S = {}

const _defaultPresets: UnsharpMaskPreset[] = [
    { radius: 0.5, amount: 35 },
    { radius: 1, amount: 100 },
    { radius: 1.5, amount: 100 },
    { radius: 0, amount: 200 },
    { radius: 1.5, amount: 200 },
    { radius: 2, amount: 200 }
]

interface UnsharpMaskPreset {
    amount: number
    radius: number
}


export class Presets extends React.Component<{}, S> {

    private presets = new PresetsManager<UnsharpMaskPreset>('unsharpmask', _defaultPresets);

    constructor(props: {}) {
        super(props);

        this.state = {
            presetEdit: null
        };
    }

    render() {
        const presets = this.presets.getAll();
        return (
            <div className="section presets">
                <Heading>{i18next.t("sharpen.presets")}</Heading>
                <div className="buttons">
                    {presets.map(this.renderPreset.bind(this))}
                </div>
            </div>
        )
    }

    renderPreset(preset: UnsharpMaskPreset, index: number) {

        const onClick = (e: React.MouseEvent) => this._onPresetButtonClick(e, preset, index);

        return (
            <sp-action-button key={"preset-unsharp-" + index} onClick={onClick}> {preset.radius}px <br /> {preset.amount}% </sp-action-button>
        )
    }

    private async _onPresetButtonClick(event: React.MouseEvent, preset: UnsharpMaskPreset, index: number) {
        try {

            const result = await filterUnsharpMask({
                amount: preset.amount,
                radius: preset.radius,
                threshold: 0,
                dialogOptions: DialogOptions.Display
            });

            if (event.altKey && result.amount && result.radius) {
                this.presets.set(index, {
                    amount: result.amount._value,
                    radius: result.radius._value
                });
                this.forceUpdate();
            }

        } catch (err) {
            await app.showAlert(err.message);
        }
    }

}