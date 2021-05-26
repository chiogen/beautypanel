import * as React from 'react'
import { DodgeAndBurn } from './tools/dodge-and-burn';
import { FrequencySeparation } from './tools/frequency-separation';
import { CurrentToolHardness } from './tools/hardness';
import { CurrentToolOpacity } from './tools/opacity';
import { Zoom } from './tools/zoom';

type P = {
    isActive: boolean
}

export const Tools = (props: P) => {

    let style: React.CSSProperties = {};
    if (!props.isActive) {
        style.display = 'none';
    }

    return (
        <div id="tools" className="page" style={style}>
            <FrequencySeparation />
            <DodgeAndBurn />
            <CurrentToolOpacity />
            <CurrentToolHardness />
            <Zoom />
        </div>
    );
}