import * as React from 'react';
import { SharpenFilters } from './sharpen/filter';
import { SharpenOptions } from './sharpen/options';
import { Presets } from './sharpen/presets';

type Props = {
    isActive: boolean
};

export const Sharpen = ({ isActive }: Props) => {
    const classes = ['page'];

    const style: React.CSSProperties = {};
    if (!isActive) {
        style.display = 'none';
    }

    return (
        <div id="sharpen" className={classes.join(' ')} style={style}>
            <SharpenFilters />
            <SharpenOptions />
            <Presets />
        </div>
    );
};