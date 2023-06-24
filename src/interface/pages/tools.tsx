import * as React from 'react';
import { DodgeAndBurn } from './tools/dodge-and-burn';
import { FrequencySeparation } from './tools/frequency-separation';
import { HardnessPresets } from './tools/hardness-presets';
import { OpacityPresets } from './tools/opacity-presets';
import { Zoom } from './tools/zoom';

export const ToolsPage = () => {
    return (
        <div id="tools" className="page">
            <FrequencySeparation />
            <DodgeAndBurn />
            <OpacityPresets />
            <HardnessPresets />
            <Zoom />
        </div>
    );
};