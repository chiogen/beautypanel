import { Page } from '../enums';
import { store, TState } from '../store';
import { ActionType } from '../store-action-types';
import i18next from 'i18next';
import * as React from 'react';
import { StatefulComponent } from '../components/base/stateful-component';
import { AppBar, Paper, Tab, Tabs } from '@material-ui/core';
import { property } from '../decorators/react-property';

// ToDo: Make Tabbar a component
const indexPageMap = [
    Page.Tools,
    Page.Sharpen,
    Page.Effects,
    Page.Save,
    Page.Settings
];

type State = {
    page: Page
};

export class Tabbar extends StatefulComponent<{}, State> {

    @property
    page: Page;

    texts: {
        tools: string
        sharpen: string
        effects: string
        settings: string
        save: string
    };

    constructor(props) {
        super(props);
        this.texts = i18next.t('tabbar', { returnObjects: true });
        const state = store.getState();
        this.state = {
            page: state.page
        };
    }

    render() {

        const index = indexPageMap.indexOf(this.page);

        return (
            <Tabs value={index} onChange={this._onTabClick} centered>
                <Tab label={this.texts.tools} />
                <Tab label={this.texts.sharpen} />
                <Tab label={this.texts.effects} />
                <Tab label={this.texts.save} />
            </Tabs>
        );
    }


    _onTabClick(_e: React.ChangeEvent<{}>, value: number) {
        store.dispatch({
            type: ActionType.SetPage,
            page: indexPageMap[value]
        });
    }

    protected stateChanged(state: TState) {
        this.page = state.page;
    }

}