import { Sharpen } from './sharpen';
import { Tools } from './tools';
import * as React from 'react';
import { StatefulComponent } from '../../components/base/stateful-component';
import { Page } from '../../enums';
import { store, TState } from '../../store';

export class Pages extends StatefulComponent {

    state: {
        page: Page
    }

    constructor(props) {
        super(props);
        const state = store.getState();
        this.state = {
            page: state.page
        };
    }
    
    render() {
        return <div className="pages">
            {this.renderActivePage()}
        </div>
    }
    private renderActivePage() {
        switch (this.state.page) {
            case Page.Tools:
                return Tools(true);
            case Page.Sharpen:
                return Sharpen(true);
            default:
                return undefined;
        }
    }

    protected stateChanged(state: TState) {
        this.setState({
            page: state.page
        });
    }

}