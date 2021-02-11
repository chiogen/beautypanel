import * as React from 'react'
import { store, TState } from '../../store';
import { DodgeAndBurn } from './tools/dodge-and-burn';
import { FrequencySeparation } from './tools/frequency-separation';
import { Hardness } from './tools/hardness';
import { Opacity } from './tools/opacity';
import { Zoom } from './tools/zoom';

type Props = {
    isActive: boolean
}
type State = {}

export class Tools extends React.Component<Props, State> {
    render() {

        const classes = ['page'];

        let style: React.CSSProperties = {};
        if (!this.props.isActive) {
            style.display = 'none';
        }

        return <div className={classes.join(' ')} style={style}>
            {FrequencySeparation()}
            <DodgeAndBurn />
            {Opacity()}
            {Hardness()}
            {Zoom()}
        </div>
    }
}