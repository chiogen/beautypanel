import * as React from 'react'
import i18next from 'i18next';
import { store, TState } from '../../../store';
import { ActionType } from '../../../store-action-types';

type P = {};
type S = {};

export function SharpenOptions() {
    return (
        <div className="section options">
            <h3>{i18next.t('options')}</h3>
            <div>
                <sp-checkbox onChange={switchToDetailLayerChanged} defaultChecked={true}>
                    {i18next.t('sharpen.switchToDetailLayer')}
                </sp-checkbox>
            </div>
        </div>
    )
}

function switchToDetailLayerChanged(e: React.FormEvent<HTMLInputElement>) {
    const isSelected = (e.target as HTMLInputElement).checked;

    store.dispatch({
        type: ActionType.SetSharpenOptions,
        useDetailLayer: isSelected
    });
}