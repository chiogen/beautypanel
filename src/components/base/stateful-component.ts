import * as React from 'react'
import { Unsubscribe } from 'redux';
import { Pages } from '../../interface/pages';
import { store, TState } from '../../store';

export abstract class StatefulComponent<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {

    private __unsubscribe?: Unsubscribe;

    componentDidMount() {
        if (super.componentDidMount) {
            super.componentDidMount();
        }
        if (!this.__unsubscribe) {
            this.__unsubscribe = store.subscribe(() => {
                const state = store.getState();
                this.stateChanged(state);
            })
        }
    }

    componentWillUnmount() {
        if (super.componentWillUnmount) {
            super.componentWillUnmount();
        }
        if (this.__unsubscribe) {
            this.__unsubscribe();
            this.__unsubscribe = undefined;
        }
    }

    protected abstract stateChanged(state: TState): void;

}