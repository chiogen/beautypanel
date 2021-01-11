import * as React from 'react'
import { Filter } from './filter';
import { Options } from './options';

export function Sharpen(isActive: boolean = false) {
    let classes = ['page'];

    if (isActive) {
        classes.push('active');
    }
    
    return <div id="sharpen" className={classes.join(' ')}>
        {Filter()}
        {Options()}
    </div>;
}