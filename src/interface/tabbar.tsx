import { Page } from "../enums";
import { ActionType, store, TState } from "../store";
import i18next from "i18next";
import * as React from 'react'
import { StatefulComponent } from "../components/base/stateful-component";
import { AppBar, Tab, Tabs } from '@material-ui/core'

// ToDo: Make Tabbar a component
const indexPageMap = [
    Page.Tools,
    Page.Sharpen,
    Page.Effects,
    Page.Save,
    Page.Settings
]

export class Tabbar extends StatefulComponent {

    state: {
        page: Page
    }

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

        const index = indexPageMap.indexOf(this.state.page);

        return (
            <Tabs value={index} onChange={this._onTabClick} >
                <Tab label={this.texts.tools}></Tab>
                <Tab label={this.texts.sharpen}></Tab>
                <Tab label={this.texts.effects}></Tab>
                <Tab label={this.texts.save}></Tab>
                <Tab label={this.texts.settings}></Tab>
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
        this.setState({
            page: state.page
        });
    }

}