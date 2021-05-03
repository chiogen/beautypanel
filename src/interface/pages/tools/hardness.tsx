import { app } from 'photoshop'
import * as React from 'react'
import i18next from "i18next";
import { hardness as defaultPresets } from './default-presets.json'
import { StatefulComponent } from '../../../components/base/stateful-component';
import { property } from '../../../decorators/react-property';
import { store, TState } from '../../../store';
import { ActionType } from '../../../store-action-types';
import { PresetsManager } from '../../../common/presets-manager';

export const hardnessPresets = new PresetsManager<number>('hardness', defaultPresets);

type State = {
    hardness: number
}

export class CurrentToolHardness extends StatefulComponent<{}, State> {

    @property hardness: number
    @property presetEditIndex?: number;
    @property presetEditValue?: number;

    constructor(props) {
        super(props);
        const state = store.getState();
        this.state = {
            hardness: state.currentToolOptions.hardness
        };
    }

    render() {
        return (
            <div className="section">
                <h2 className="title">{i18next.t('hardness')}</h2>
                {this.renderPresetEdit()}
                <div className="flex stretch">
                    {this.renderPresetButton(0)}
                    {this.renderPresetButton(1)}
                    {this.renderPresetButton(2)}
                    {this.renderPresetButton(3)}
                    {this.renderPresetButton(4)}
                </div>
            </div>
        )
    }
    private renderPresetEdit() {
        if (typeof this.presetEditIndex !== 'number')
            return undefined;

        const index = this.presetEditIndex;
        const currentValue = this.presetEditValue ?? hardnessPresets.get(index);

        return (
            <div className="dialog">
                <h3>Preset Edit</h3>
                <div className="flex" style={{ alignItems: "center" }}>
                    <sp-textfield placeholder="Value" type="number" defaultValue={currentValue} onInput={this._presetInputValueChanged}></sp-textfield>
                </div>
                <div className="dialog-actions">
                    <sp-action-button onClick={this.cancelPresetEdit}>{i18next.t('cancel')}</sp-action-button>
                    <sp-action-button onClick={this.applyPresetEdit}>OK</sp-action-button>
                </div>
            </div>
        );
    }
    private _presetInputValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.presetEditValue = parseInt(e.currentTarget.value.replace(/,/, '.'));
    }
    private cancelPresetEdit = () => {
        this.presetEditIndex = undefined;
        this.presetEditValue = undefined;
    }
    private applyPresetEdit = () => {
        try {
            if (typeof this.presetEditIndex !== 'number')
                return;

            // If presetEditValue is undefined, the value hasn't changed.
            if (typeof this.presetEditValue === 'number') {

                if (this.presetEditValue < 0 || this.presetEditValue > 100) {
                    throw new Error('Invalid value: ' + this.presetEditValue);
                }

                hardnessPresets.set(this.presetEditIndex, this.presetEditValue);
            }

            this.presetEditIndex = undefined;
            this.presetEditValue = undefined;

        } catch (err) {
            app.showAlert(err.message);
        }
    }

    private renderPresetButton(index: number) {
        const value = hardnessPresets.get(index);
        const isActive = Math.abs(value - this.hardness) < 1e-8;

        const onClick = (e: any) => this.onPresetClick(e);

        return <sp-action-button data-index={index} data-active={isActive} onClick={onClick}>{value}%</sp-action-button>;
    }

    private async onPresetClick(e: React.MouseEvent<HTMLButtonElement>) {

        const button = e.currentTarget as HTMLButtonElement;

        if (e.button === 0 && e.altKey) {
            const index = parseInt(button.dataset.index!);
            this.presetEditIndex = index;
            return;
        }

        if (e.button === 0) {
            const index = parseInt(button.dataset.index!);
            const value = hardnessPresets.get(index);
            store.dispatch({
                type: ActionType.SetToolHardness,
                value
            });
        }
    }

    stateChanged(state: TState) {
        this.hardness = state.currentToolOptions.hardness;
    }

}