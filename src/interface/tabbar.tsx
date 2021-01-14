import { Page } from "../enums";
import { ActionType, store, TState } from "../store";
import i18next from "i18next";
import * as React from 'react'
import { StatefulComponent } from "../components/base/stateful-component";

// ToDo: Make Tabbar a component

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
    }

    constructor(props) {
        super(props);
        this.texts = i18next.t('tabbar', { returnObjects: true });
        const state = store.getState();
        this.state = {
            page: state.page
        };
    }

    render() {
        return <div id="tabbar">
            {this.renderTab(Page.Tools, this.texts.tools)}
            {this.renderTab(Page.Sharpen, this.texts.sharpen)}
            {this.renderTab(Page.Effects, this.texts.effects)}
            {this.renderTab(Page.Save, this.texts.save)}
            {this.renderTab(Page.Settings, this.texts.settings)}
        </div>;
    }
    renderTab(page: Page, label: string) {
        let classNames = ['tab'];
        if (page === this.state.page) {
            classNames.push('selected');
        }

        return <div className={classNames.join(' ')} onClick={() => this._onTabClick(page)}>
            <div className="tab_underline"></div>
            {label}
        </div>;
    }

    _onTabClick(page: Page) {
        store.dispatch({
            type: ActionType.SetPage,
            page
        });
    }

    protected stateChanged(state: TState) {
        this.setState({
            page: state.page
        });
    }

}