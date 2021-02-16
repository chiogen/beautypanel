import * as React from 'react'
import i18next from "i18next";
import { percent } from '../../../common/units';
import { hardness as defaultPresets } from './default-presets.json'
import { setToolOptions } from '../../../common/app-utils';
import { StatefulComponent } from '../../../components/base/stateful-component';
import { property } from '../../../decorators/react-property';
import { store, TState } from '../../../store';
import { ActionType } from '../../../store-action-types';

let numberOfPresets = 5;
let presets: Array<number> = new Array(numberOfPresets);

for (let i = 0; i < numberOfPresets; i++) {
    let value = localStorage.getItem('opacity-preset-' + i);
    if (value) {
        presets[i] = parseFloat(value);
    } else {
        presets[i] = defaultPresets[i];
    }
}

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
        const value = getPresetValue(index);
        const isActive = Math.abs(value - this.hardness) < 1e-8;

        return <sp-action-button data-index={index} data-active={isActive} onClick={onHardnessPresetClick}>{value}%</sp-action-button>;
    }

    stateChanged(state: TState) {
        this.hardness = state.currentToolOptions.hardness;
    }

}

async function onHardnessPresetClick(e: React.MouseEvent<HTMLButtonElement>) {

    const button = e.currentTarget as HTMLButtonElement;
    const index = parseInt(button.dataset.index!);

    if (e.button === 0) {
        const value = getPresetValue(index);
        store.dispatch({
            type: ActionType.SetToolHardness,
            value
        });
    }
}

function getPresetValue(index: number): number {
    const key = 'hardness-preset-' + index;
    let value = localStorage.getItem(key);
    return value ? parseInt(value) : defaultPresets[index];
}