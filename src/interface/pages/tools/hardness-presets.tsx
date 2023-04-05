import i18next from 'i18next';
import * as React from 'react';
import { HardnessPresetButton } from './hardness-preset-button';
import { HardnessPresetEditDialog } from './hardness-preset-edit-dialog';

export const HardnessPresets = () => (
    <div className="section">
        <h2 className="title">{i18next.t('hardness')}</h2>
        <HardnessPresetEditDialog />
        <div className="flex stretch">
            <HardnessPresetButton index={0} />
            <HardnessPresetButton index={1} />
            <HardnessPresetButton index={2} />
            <HardnessPresetButton index={3} />
            <HardnessPresetButton index={4} />
        </div>
    </div>
);