import * as React from 'react'
import { Page } from '../../enums';
import { Filter } from './sharpen/filter';
import { SharpenOptions } from './sharpen/options';
import { Presets } from './sharpen/presets';

type Props = {
    isActive: boolean
}

export class Sharpen extends React.Component<Props> {

    public getPageKey() {
        return Page.Sharpen;
    }

    render() {        
        const classes = ['page'];
        
        let style: React.CSSProperties = {};
        if (!this.props.isActive) {
            style.display = 'none';
        }

        return <div id="sharpen" className={classes.join(' ')} style={style}>
            {Filter()}
            <SharpenOptions />
            {Presets()}
        </div>;
    }

}