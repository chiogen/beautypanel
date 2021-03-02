import * as React from 'react'
import { Checkbox, Heading } from '@adobe/react-spectrum'
import i18next from 'i18next';
import { StatefulComponent } from '../../../components/base/stateful-component';
import { property } from '../../../decorators/react-property';
import { TState } from '../../../store';

type P = {};
type S = {
    switchToDetailLayer: boolean
};

export class SharpenOptions extends StatefulComponent<P, S> {

    @property switchToDetailLayer: boolean;

    constructor(props: P) {
        super(props);
        this.state = {
            switchToDetailLayer: false
        };
    }

    render() {
        return (
            <div className="section options">
                <Heading># {i18next.t('options')}</Heading>
                <div className="checkbox">
                    <sp-checkbox>{i18next.t('sharpen.switchToDetailLayer')}</sp-checkbox>
                </div>
            </div>            
        );
    }

    stateChanged(state: TState) {

    }

}