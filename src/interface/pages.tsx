import * as React from 'react';
import { useSelector } from 'react-redux';
import { TState } from '../store';
import { EffectsPage } from './pages/effects';
import { SavePage } from './pages/save';
import { SharpenPage } from './pages/sharpen';
import { ToolsPage } from './pages/tools';
import { Page } from '../enums';

export const Pages = () => {
    const activePage = useSelector((state: TState) => state.page);

    return <div className="pages">
        <ActivePageTemplate page={activePage} />
    </div>;
};

type ActivePageTemplateProps = {
    page: Page
};
const ActivePageTemplate = ({ page }: ActivePageTemplateProps) => {
    switch (page) {
        case Page.Tools:
            return <ToolsPage />;
        case Page.Sharpen:
            return <SharpenPage />;
        case Page.Effects:
            return <EffectsPage />;
        case Page.Save:
            return <SavePage />;
        default: return <></>;
    }
};