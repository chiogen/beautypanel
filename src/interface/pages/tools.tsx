import * as React from 'react';
import { DodgeAndBurn } from './tools/dodge-and-burn';
import { FrequencySeparation } from './tools/frequency-separation';
import { HardnessPresets } from './tools/hardness-presets';
import { OpacityPresets } from './tools/opacity-presets';
import { Zoom } from './tools/zoom';
import { Page } from '../../enums';
import { TState } from '../../store';
import { useSelector } from 'react-redux';

export const ToolsPage = () => {

    const isActive = useSelector((state: TState) => state.page === Page.Tools);

    const style: React.CSSProperties = {};
    if (!isActive) {
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