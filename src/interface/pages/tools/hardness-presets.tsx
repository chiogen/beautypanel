import i18next from 'i18next';
import * as React from 'react';
import { HardnessPresetButton } from './hardness-preset-button';
import { HardnessPresetEditDialog } from './hardness-preset-edit-dialog';
import { Card } from '../../../components/card';

export const HardnessPresets = () => (
    <>
        <Card title={i18next.t('hardness')} contentStyle='inline-stretch'>
            <HardnessPresetButton index={0} />
            <HardnessPresetButton index={1} />
            <HardnessPresetButton index={2} />
            <HardnessPresetButton index={3} />
            <HardnessPresetButton index={4} />
        </Card>
        <HardnessPresetEditDialog />
    </>
);