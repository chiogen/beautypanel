import i18next from 'i18next';
import * as React from 'react';
import { OpacityPresetButton } from './opacity-preset-button';
import { OpacityPresetEditDialog } from './opacity-preset-edit-dialog';
import { Card } from '../../../components/card';

export const OpacityPresets = () => (
    <>
        <Card title={i18next.t('opacity')} contentStyle='inline-stretch'>
            <OpacityPresetButton index={0} />
            <OpacityPresetButton index={1} />
            <OpacityPresetButton index={2} />
            <OpacityPresetButton index={3} />
            <OpacityPresetButton index={4} />
        </Card>
        <OpacityPresetEditDialog />
    </>
);
