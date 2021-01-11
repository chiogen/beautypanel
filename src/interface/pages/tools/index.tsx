import * as React from 'react'
import { DodgeAndBurn } from './dodge-and-burn';
import { FrequencySeparation } from './frequency-separation';
import { Hardness } from './hardness';
import { Opacity } from './opacity';
import { Zoom } from './zoom';

export function Tools(isActive: boolean = false) {
    let classes = ['page'];

    if (isActive) {
        classes.push('active');
    }

    return <div id="tools" className={classes.join(' ')}>
        {FrequencySeparation()}
        {DodgeAndBurn()}
        {Opacity()}
        {Hardness()}
        {Zoom()}
    </div>;
}