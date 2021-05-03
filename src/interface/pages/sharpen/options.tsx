import * as React from 'react'
import { Checkbox, Heading } from '@adobe/react-spectrum'
import i18next from 'i18next';
import { store, TState } from '../../../store';
import { ActionType } from '../../../store-action-types';

type P = {};
type S = {};

export class SharpenOptions extends React.Component<P, S> {

    render() {
        const _switchToDetailLayerChanged = this._switchToDetailLayerChanged.bind(this);

        return (
            <div className="section options">
                <Heading>{i18next.t('options')}</Heading>
                <div className="checkbox">
                    <Checkbox onChange={_switchToDetailLayerChanged} defaultSelected={true}>
                        <span className="form-label">{i18next.t('sharpen.switchToDetailLayer')}</span>
                    </Checkbox>                    
                </div>
            </div>            
        );
    }

    private _switchToDetailLayerChanged(isSelected: boolean) {
        store.dispatch({
            type: ActionType.SetSharpenOptions,
            useDetailLayer: isSelected
        });
    }

}