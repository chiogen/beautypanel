import i18next from "i18next";
import * as React from 'react'
import { StatefulComponent } from "../../../components/base/stateful-component";
import { property } from "../../../decorators/react-property";
import { store, TState } from "../../../store";
import { ActionType } from "../../../store-action-types";
import { opacity as defaultPresets } from './default-presets.json'
import { PresetsManager } from "../../../common/presets-manager";
import { app } from "photoshop";
import { Heading, Grid, repeat, Flex } from '@adobe/react-spectrum'

type State = {
    opacity: number
}

export const opacityPresets = new PresetsManager<number>('opacity', defaultPresets)


export class CurrentToolOpacity extends StatefulComponent<{}, State> {

    @property opacity: number
    @property presetEditIndex?: number;
    @property presetEditValue?: number;

    constructor(props) {
        super(props);
        const state = store.getState();
        this.state = {
            opacity: state.currentToolOptions.opacity
        };
    }

    render() {
        return (
            <div className="section">
                <h3 className="title">{i18next.t('opacity')}</h3>
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
    private renderPresetButton(index: number) {

        const value = opacityPresets.get(index);
        const isActive = Math.abs(value - this.opacity) < 1e-8;

        const onClick = (e: React.MouseEvent<HTMLButtonElement>) => this.onPresetClick(e);

        return (
            <sp-action-button data-index={index} data-active={isActive} onClick={onClick}>{value}%</sp-action-button>
        );
    }

    private renderPresetEdit() {
        if (typeof this.presetEditIndex !== 'number')
            return undefined;

        const index = this.presetEditIndex;
        const currentValue = this.presetEditValue ?? opacityPresets.get(index);

        return (
            <div className="dialog">
                <Heading>Preset Edit</Heading>
                <div className="flex" style={{ alignItems: "center" }}>
                    <sp-textfield placeholder="Value" type="number" defaultValue={currentValue} onInput={this._presetInputValueChanged}></sp-textfield>
                </div>
                <div className="flex stretch">
                    <sp-action-button onClick={this.cancelPresetEdit}>{i18next.t('cancel')}</sp-action-button>
                    <sp-action-button onClick={this.applyPresetEdit}>OK</sp-action-button>
                </div>
            </div>
        );
    }
    private _presetInputValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(e.currentTarget.value.replace(/,/, '.'));
        if (!Number.isNaN(value)) {
            this.presetEditValue = value ?? -1;
        }
    }
    private cancelPresetEdit = () => {
        this.presetEditIndex = undefined;
        this.presetEditValue = undefined;
    }
    private applyPresetEdit = () => {
        try {
            if (typeof this.presetEditIndex !== 'number')
                return;

            if (typeof this.presetEditValue === 'number') {

                if (this.presetEditValue < 0 || this.presetEditValue > 100) {
                    throw new Error('Invalid value: ' + this.presetEditValue);
                }

                opacityPresets.set(this.presetEditIndex, this.presetEditValue);
            }

            this.presetEditIndex = undefined;
            this.presetEditValue = undefined;
        } catch (err) {
            app.showAlert(err);
        }
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
            const value = opacityPresets.get(index);
            store.dispatch({
                type: ActionType.SetToolOpacity,
                value
            });
        }
    }

    stateChanged(state: TState) {
        this.opacity = state.currentToolOptions.opacity;
    }

}