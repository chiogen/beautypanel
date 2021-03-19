import * as React from "react"
import i18next from "i18next";
import { Flex, Heading } from "@adobe/react-spectrum";
import { PresetsManager } from "../../../common/presets-manager";
import { app } from "photoshop";
import { filterUnsharpMask } from "../../../modules/filter/sharpen/unsharp-mask";
import { property } from "../../../decorators/react-property";

type S = {
    presetEdit: PresetEdit | null
}

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

interface PresetEdit {
    index: number
    preset: UnsharpMaskPreset
}


export class Presets extends React.Component<{}, S> {

    private presets = new PresetsManager<UnsharpMaskPreset>('unsharpmask', _defaultPresets);
    private _presetEditAmountValue?: number;
    private _presetEditRadiusValue?: number;

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
                {this.renderPresetEdit()}
                <div className="buttons">
                    {presets.map(this.renderPreset.bind(this))}
                </div>
            </div>
        )
    }

    renderPresetEdit() {

        if (!this.state.presetEdit) {
            return undefined;
        }

        const preset = this.state.presetEdit.preset;

        const lineStyle: React.CSSProperties = {
            display: "flex",
            alignItems: "center"
        };
        const inputStyles: React.CSSProperties = {

        }

        const cancel = () => this._cancelPresetEdit();
        const submit = () => this._submitPresetEdit();

        const onAmountChanged = (e: React.ChangeEvent) => {
            const element = e.target as HTMLInputElement;
            if (this.state.presetEdit?.preset) {
                preset.amount = parseFloat(element.value.replace(/,/, '.'));
            }
        };
        const onRadiusChanged = (e: React.ChangeEvent) => {
            const element = e.target as HTMLInputElement;
            if (this.state.presetEdit?.preset) {
                preset.radius = parseFloat(element.value.replace(/,/, '.'));
            }
        };

        return (
            <div className="dialog">
                <div className="dialog-body">
                    <Heading>Preset Edit</Heading>
                    <div style={lineStyle}>
                        <span>Amount: </span>
                        <input type="number" style={inputStyles} defaultValue={preset.amount} onChange={onAmountChanged} />%
                    </div>
                    <div style={lineStyle}>
                        <span>Radius: </span>
                        <input type="number" style={inputStyles} defaultValue={preset.radius} onChange={onRadiusChanged} />px
                    </div>
                    <div className="dialog-actions">
                        <sp-action-button onClick={cancel}>{i18next.t('cancel')}</sp-action-button>
                        <sp-action-button onClick={submit}>OK</sp-action-button>
                    </div>
                </div>
            </div>
        )
    }

    renderPreset(preset: UnsharpMaskPreset, index: number) {

        const onClick = (e: React.MouseEvent) => this._executePreset(e, preset, index); 

        return (
            <sp-action-button key={"preset-unsharp-" + index} onClick={onClick}> {preset.radius}px <br/> {preset.amount}% </sp-action-button>
        )
    }

    private _submitPresetEdit() {
        const edit = this.state.presetEdit;

        if (!edit) {
            return;
        }

        this.presets.set(edit.index, edit.preset);

        this.setState({
            presetEdit: null
        });
    }
    private _cancelPresetEdit() {
        this.setState({
            presetEdit: null
        });
    }

    private async _executePreset(event: React.MouseEvent, preset: UnsharpMaskPreset, index: number) {
        try {

            if (event.altKey) {
                this.setState({
                    presetEdit: {
                        index,
                        preset
                    }
                });
                return;
            }

            await filterUnsharpMask({
                amount: preset.amount,
                radius: preset.radius,
                threshold: 0
            });

        } catch(err) {
            await app.showAlert(err.message);
        }
    }

}