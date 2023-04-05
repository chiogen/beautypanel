import * as React from 'react';
import { useSelector } from 'react-redux';
import { Page } from '../enums';
import { TState } from '../store';
import { EffectsPage } from './pages/effects';
import { SharpenPage } from './pages/sharpen';
import { ToolsPage } from './pages/tools';
import { SavePage } from './save';

export const Pages = () => {
    const activePage = useSelector((state: TState) => state.page);

    return <div className="pages">
        <ToolsPage />
        <SharpenPage />
        <EffectsPage />
        <SavePage isActive={activePage === Page.Save} />
    </div>;
};