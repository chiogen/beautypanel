import i18next from "i18next";
import * as React from 'react'
import { StatefulComponent } from "../../../components/base/stateful-component";
import { property } from "../../../decorators/react-property";
import { PresetEditState } from "../../../reducer/preset-edit";
import { store, TState } from "../../../store";
import { ActionType } from "../../../store-action-types";
import { opacity as defaultPresets } from './default-presets.json'
import { Slider } from '@material-ui/core'

type State = {
    opacity: number
    presetEdit: PresetEditState | null
}

export abstract class OpacityPresets {

    private static readonly _onChangedCallbacks = new Array<() => void>();

    public static addOnChangedCallback(value: () => void) {
        const callbacks = this._onChangedCallbacks;
        
        if (callbacks.includes(value)) {
            return;
        }

        callbacks.push(value);
        return () => {
            const index = callbacks.indexOf(value);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    public static get(index: number) {
        const key = 'opacity-preset-' + index;
        let value = localStorage.getItem(key);
        return value ? parseInt(value) : defaultPresets[index];
    }
    public static set(index: number, value: number) {

    }
    public static apply(index: number) {
        store.dispatch({
            type: ActionType.SetToolOpacity,
            value: this.get(index)
        });
    }
}


export class CurrentToolOpacity extends StatefulComponent<{}, State> {

    private readonly _sliderId = "opacity-preset-slider"

    @property opacity: number
    @property presetEdit: PresetEditState
    @property presetEditValue?: number;

    constructor(props) {
        super(props);
        const state = store.getState();
        this.state = {
            opacity: state.currentToolOptions.opacity,
            presetEdit: null
        };
    }

    render() {
        return (
            <div className="section">
                <h3 className="title">{i18next.t('opacity')}</h3>
                {this.renderPresetEdit()}
                <div className="flex-buttons">
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
        if (!this.presetEdit)
            return undefined;

        const index= this.presetEdit.index;
        const label = i18next.t('opacityPreset', { index });
        const currentValue = this.presetEditValue ?? OpacityPresets.get(index);

        return <>
            <preset-edit-dialog>
                <preset-edit-dialog-slider>
                    <span>0</span>
                    <input type="range" min="0" max="100" onChange={this._presetInputValueChanged} />
                    <span>100</span>
                </preset-edit-dialog-slider>
                <div className="current-value-label">{currentValue}%</div>
                <sp-action-button onClick={this.applyPresetEdit.bind(this)}>OK</sp-action-button>
            </preset-edit-dialog>
        </>
    }
    private _presetInputValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.presetEditValue = parseInt(e.currentTarget.value);
    }

    private renderPresetButton(index: number) {

        const value = OpacityPresets.get(index);
        const isActive = Math.abs(value - this.opacity) < 1e-8;

        const onClick = (e: React.MouseEvent<HTMLButtonElement>) => this.onOpacityPresetClick(e);
        const onContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => this.onOpacityPresetContextMenu(e);

        return (
            <sp-action-button data-index={index} data-active={isActive} onClick={onClick} onContextMenu={onContextMenu}>{value}%</sp-action-button>
        );
    }

    private applyPresetEdit(_e: React.MouseEvent<HTMLButtonElement>) {
        store.dispatch({
            type: ActionType.EndPresetEdit
        });
    }

    private async onOpacityPresetClick(e: React.MouseEvent<HTMLButtonElement>) {
        const button = e.currentTarget as HTMLButtonElement;
        const index = parseInt(button.dataset.index!);

        if (e.button === 0 && e.altKey) {
            return this.onOpacityPresetContextMenu(e);
        }

        if (e.button === 0) {
            OpacityPresets.apply(index);
        }
    }

    private async onOpacityPresetContextMenu(e: React.MouseEvent<HTMLButtonElement>) {
        const button = e.currentTarget as HTMLButtonElement;
        const index = parseInt(button.dataset.index!);

        store.dispatch({
            type: ActionType.StartPresetEdit,
            edit: {
                type: 'opacity',
                index
            }
        })

    }

    stateChanged(state: TState) {
        this.opacity = state.currentToolOptions.opacity;

        if (state.presetEdit?.type === 'opacity') {
            this.presetEdit = state.presetEdit;
        } else {
            this.presetEdit = null;
        }
    }

}