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

    @property
    hardness: number

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

    private renderPresetButton(index: number) {
        const value = hardnessPresets.get(index);
        const isActive = Math.abs(value - this.hardness) < 1e-8;

        const onClick = (e: any) => this.onHardnessPresetClick(e);

        return <sp-action-button data-index={index} data-active={isActive} onClick={onClick}>{value}%</sp-action-button>;
    }

    private async onHardnessPresetClick(e: React.MouseEvent<HTMLButtonElement>) {
    
        const button = e.currentTarget as HTMLButtonElement;
        const index = parseInt(button.dataset.index!);
    
        if (e.button === 0) {
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