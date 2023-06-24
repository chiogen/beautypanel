import * as React from 'react';
import { SharpenFilters } from './sharpen/filter';
import { SharpenOptions } from './sharpen/options';
import { Presets } from './sharpen/presets';

export const SharpenPage = () => {
    return (
        <div id="sharpen" className="page">
            <SharpenFilters />
            <SharpenOptions />
            <Presets />
        </div>
    );
};