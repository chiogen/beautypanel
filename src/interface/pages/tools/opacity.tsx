import i18next from "i18next";
import * as React from 'react'
import { StatefulComponent } from "../../../components/base/stateful-component";
import { property } from "../../../decorators/react-property";
import { PresetEditState } from "../../../reducer/preset-edit";
import { store, TState } from "../../../store";
import { ActionType } from "../../../store-action-types";
import { opacity as defaultPresets } from './default-presets.json'
import { Slider } from '@adobe/react-spectrum'

type State = {
    opacity: number
    presetEdit: PresetEditState | null
}

export class CurrentToolOpacity extends StatefulComponent<{}, State> {

    @property opacity: number
    @property presetEdit: PresetEditState

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

        const { index } = this.presetEdit ?? { index: 3 };
        const label = i18next.t('opacityPreset', { index });
        const currentValue = getOpacityPresetValue(index);

        return <>
            <preset-edit-dialog>
                <sp-slider></sp-slider>
                <sp-action-button onClick={this.applyPresetEdit.bind(this)}>OK</sp-action-button>
            </preset-edit-dialog>
        </>
    }

    private renderPresetButton(index: number) {

        const value = getOpacityPresetValue(index);
        const isActive = Math.abs(value - this.opacity) < 1e-8;

        return (
            <sp-action-button data-index={index} data-active={isActive} onClick={onOpacityPresetClick} onContextMenu={onOpacityPresetContextMenu}>{value}%</sp-action-button>
        );
    }

    private applyPresetEdit(_e: React.MouseEvent<HTMLButtonElement>) {

        store.dispatch({
            type: ActionType.EndPresetEdit
        });
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

async function onOpacityPresetClick(e: React.MouseEvent<HTMLButtonElement>) {
    const button = e.currentTarget as HTMLButtonElement;
    const index = parseInt(button.dataset.index!);

    if (e.button === 0 && e.altKey) {
        return onOpacityPresetContextMenu(e);
    }

    if (e.button === 0) {
        const value = getOpacityPresetValue(index);
        store.dispatch({
            type: ActionType.SetToolOpacity,
            value
        });
    }
}
async function onOpacityPresetContextMenu(e: React.MouseEvent<HTMLButtonElement>) {
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

export function getOpacityPresetValue(index: number): number {
    const key = 'opacity-preset-' + index;
    let value = localStorage.getItem(key);
    return value ? parseInt(value) : defaultPresets[index];
}