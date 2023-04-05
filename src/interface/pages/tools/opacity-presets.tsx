import i18next from 'i18next';
import * as React from 'react';
import { OpacityPresetButton } from './opacity-preset-button';
import { OpacityPresetEditDialog } from './opacity-preset-edit-dialog';

export const OpacityPresets = () => (
    <div className="section">
        <h3 className="title">{i18next.t('opacity')}</h3>
        <div className="flex stretch">
            <OpacityPresetButton index={0} />
            <OpacityPresetButton index={1} />
            <OpacityPresetButton index={2} />
            <OpacityPresetButton index={3} />
            <OpacityPresetButton index={4} />
        </div>
        <OpacityPresetEditDialog />
    </div>
);
