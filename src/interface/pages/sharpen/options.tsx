import i18next from 'i18next';
import * as React from 'react';
import { setUseDetailLayer } from '../../../reducer/sharpen-options';
import { store } from '../../../store';
import type { Checkbox } from '@spectrum-web-components/checkbox';
import { Card } from '../../../components/card';

export function SharpenOptions() {
    return (
        <Card title={i18next.t('options')}>
            <div className='sharpen-options'>
                <sp-checkbox onChange={switchToDetailLayerChanged} defaultChecked={true}>
                    {i18next.t('sharpen.switchToDetailLayer')}
                </sp-checkbox>
            </div>
        </Card>
    );
}

function switchToDetailLayerChanged(e: React.FormEvent<Checkbox>) {
    const isSelected = e.currentTarget.checked;
    store.dispatch(setUseDetailLayer(isSelected));
}