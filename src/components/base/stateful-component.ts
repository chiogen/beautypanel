import * as React from 'react';
import { Unsubscribe } from 'redux';
import { property } from '../../decorators/react-property';
import { Pages } from '../../interface/pages';
import { store, TState } from '../../store';

export abstract class StatefulComponent<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {

    private _frame?: number;
    private _nextState: object = {};
    private __unsubscribe?: Unsubscribe;

    componentDidMount() {
        if (super.componentDidMount) {
            super.componentDidMount();
        }
        if (!this.__unsubscribe) {
            this.__unsubscribe = store.subscribe(() => {
                const state = store.getState();
                this.stateChanged(state);
            });
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

    enqueueStateChange(property: string, value: any) {
        this._nextState[property] = value;

        if (!this._frame) {
            this._frame = requestAnimationFrame(() => {
                this._frame = undefined;
                this.setState({
                    ...this.state,
                    ...this._nextState
                });
            });
        }
    }

    protected abstract stateChanged(state: TState): void;

}