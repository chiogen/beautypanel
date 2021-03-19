import { app } from 'photoshop'
import * as React from 'react'
import i18next from "i18next";
import { hardness as defaultPresets } from './default-presets.json'
import { StatefulComponent } from '../../../components/base/stateful-component';
import { property } from '../../../decorators/react-property';
import { store, TState } from '../../../store';
import { ActionType } from '../../../store-action-types';
import { PresetsManager } from '../../../common/presets-manager';
import { PresetEditState } from '../../../reducer/preset-edit';
import { Heading } from '@react-spectrum/text';

export const hardnessPresets = new PresetsManager<number>('hardness', defaultPresets);

type State = {
    hardness: number
}

export class CurrentToolHardness extends StatefulComponent<{}, State> {

    @property
    hardness: number
    @property presetEdit: PresetEditState
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

        const lineStyle: React.CSSProperties = {
            display: "flex",
            alignItems: "center"
        }

        const index = this.presetEdit.index;
        const currentValue = this.presetEditValue ?? hardnessPresets.get(index);

        const onValueChanged = this._presetInputValueChanged.bind(this);

        const cancel = () => this.cancelPresetEdit();
        const submit = () => this.applyPresetEdit();


        return (
            <div className="dialog">
                <Heading>Preset Edit</Heading>
                    <div style={lineStyle}>
                        <input type="number" min="0" max="100" defaultValue={currentValue} onInput={onValueChanged} /> <span>%</span>
                    </div>
                <div className="dialog-actions">
                    <sp-action-button onClick={cancel}>{i18next.t('cancel')}</sp-action-button>
                    <sp-action-button onClick={submit}>OK</sp-action-button>
                </div>
            </div>
        );
    }
    private _presetInputValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.presetEditValue = parseInt(e.currentTarget.value.replace(/,/, '.'));
    }
    private applyPresetEdit() {
        if (!this.presetEdit)
            return;

        if (typeof this.presetEditValue !== 'number' || this.presetEditValue < 0 || this.presetEditValue > 100) {
            app.showAlert('Invalid value: ' + this.presetEditValue);
            return;
        }

        hardnessPresets.set(this.presetEdit.index, this.presetEditValue!)
        store.dispatch({
            type: ActionType.EndPresetEdit
        });
    }
    private cancelPresetEdit() {
        store.dispatch({
            type: ActionType.EndPresetEdit
        });
    }

    private renderPresetButton(index: number) {
        const value = hardnessPresets.get(index);
        const isActive = Math.abs(value - this.hardness) < 1e-8;

        const onClick = (e: any) => this.onPresetClick(e);
        const onContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => this.onPresetContextMenu(e);

        return <sp-action-button data-index={index} data-active={isActive} onClick={onClick} onContextMenu={onContextMenu}>{value}%</sp-action-button>;
    }

    private async onPresetClick(e: React.MouseEvent<HTMLButtonElement>) {

        const button = e.currentTarget as HTMLButtonElement;

        if (e.button === 0 && e.altKey) {
            return this.onPresetContextMenu(e);
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

    private async onPresetContextMenu(e: React.MouseEvent<HTMLButtonElement>) {
        const button = e.currentTarget as HTMLButtonElement;
        const index = parseInt(button.dataset.index!);

        store.dispatch({
            type: ActionType.StartPresetEdit,
            edit: {
                type: 'hardness',
                index
            }
        })

    }

    stateChanged(state: TState) {
        this.hardness = state.currentToolOptions.hardness;

        if (state.presetEdit?.type === 'hardness') {
            this.presetEdit = state.presetEdit;
        } else {
            this.presetEdit = null;
        }
    }

}