import * as React from 'react';
import { SharpenFilters } from './sharpen/filter';
import { SharpenOptions } from './sharpen/options';
import { Presets } from './sharpen/presets';
import { useSelector } from 'react-redux';
import { TState } from '../../store';
import { Page } from '../../enums';

export const SharpenPage = () => {

    const isActive = useSelector((state: TState) => state.page === Page.Sharpen);

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