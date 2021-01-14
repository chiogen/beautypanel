import { Sharpen } from './pages/sharpen';
import { Tools } from './pages/tools';
import * as React from 'react';
import { StatefulComponent } from '../components/base/stateful-component';
import { store, TState } from '../store';
import { Page } from '../enums';
import { Effects } from './pages/effects';
import { SavePage } from './save';

type S = {
    page: Page
}

export class Pages extends StatefulComponent<{}, S> {

    constructor(props) {
        super(props);
        const state = store.getState();
        this.state = {
            page: state.page
        };
    }

    render() {
        const { page } = this.state;

        return <div className="pages">
            <Tools isActive={page === Page.Tools} />
            <Sharpen isActive={page === Page.Sharpen} />
            <Effects isActive={page === Page.Effects} />
            <SavePage isActive={page === Page.Save} />
        </div>
    }

    protected stateChanged(state: TState) {
        this.setState({
            ...this.state,
            page: state.page
        });
    }

}