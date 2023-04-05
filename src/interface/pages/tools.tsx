import * as React from 'react';
import { DodgeAndBurn } from './tools/dodge-and-burn';
import { FrequencySeparation } from './tools/frequency-separation';
import { HardnessPresets } from './tools/hardness-presets';
import { OpacityPresets } from './tools/opacity-presets';
import { Zoom } from './tools/zoom';

type P = {
    isActive: boolean
};

export const Tools = (props: P) => {

    const style: React.CSSProperties = {};
    if (!props.isActive) {
        style.display = 'none';
    }

    return (
        <div id="tools" className="page" style={style}>
            <FrequencySeparation />
            <DodgeAndBurn />
            <OpacityPresets />
            <HardnessPresets />
            <Zoom />
        </div>
    );
};