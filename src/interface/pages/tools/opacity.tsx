import i18next from "i18next";
import * as React from 'react'
import { AppUtils } from '../../../common/app-utils';
import { percent } from '../../../common/type-utils';
import { StatefulComponent } from "../../../components/base/stateful-component";
import { property } from "../../../decorators/react-property";
import { store, TState } from "../../../store";
import { opacity as defaultPresets } from './default-presets.json'

type State = {
    opacity: number
}

export class CurrentToolOpacity extends StatefulComponent<{}, State> {

    @property
    opacity: number

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

        const value = getOpacityPresetValue(index);
        const isActive = Math.abs(value - this.opacity) < 1e-8;

        return <sp-action-button data-index={index} data-active={isActive} onClick={onOpacityPresetClick}>{value}%</sp-action-button>;
    }

    stateChanged(state: TState) {
        this.opacity = state.currentToolOptions.opacity;
    }

}

async function onOpacityPresetClick(e: React.MouseEvent<HTMLButtonElement>) {
    const button = e.currentTarget as HTMLButtonElement;
    const index = parseInt(button.dataset.index!);

    if (e.button === 0) {
        await applyOpacityPreset(index);
    }
}

async function applyOpacityPreset(index: number) {
    const value = getOpacityPresetValue(index);
    await AppUtils.setToolOptions({
        opacity: percent(value)
    });
}

export function getOpacityPresetValue(index: number): number {
    const key = 'opacity-preset-' + index;
    let value = localStorage.getItem(key);
    return value ? parseInt(value) : defaultPresets[index];
}