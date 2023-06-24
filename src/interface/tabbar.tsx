import { Tab, Tabs } from '@material-ui/core';
import i18next from 'i18next';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Page } from '../enums';
import { setPage } from '../reducer/page';
import { TState, store } from '../store';

// ToDo: Make Tabbar a component
const indexPageMap = [
    Page.Tools,
    Page.Sharpen,
    Page.Effects,
    Page.Save
];

export const Tabbar = () => {
    const page = useSelector((state: TState) => state.page);
    const index = indexPageMap.indexOf(page);

    const onTabClick = (e: React.ChangeEvent<{}>, value: number) => {
        store.dispatch(setPage(indexPageMap[value]));
    };

    return (
        <Tabs value={index} onChange={onTabClick} centered>
            <Tab label={i18next.t('tabbar.tools')} />
            <Tab label={i18next.t('tabbar.sharpen')} />
            <Tab label={i18next.t('tabbar.effects')} />
            <Tab label={i18next.t('tabbar.save')} />
        </Tabs>
    );
};
