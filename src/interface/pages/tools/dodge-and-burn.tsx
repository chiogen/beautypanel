import i18next from 'i18next';
import { app, core } from 'photoshop';
import * as React from 'react';
import { StatefulComponent } from '../../../components/base/stateful-component';
import { property } from '../../../decorators/react-property';
import { executeDodgeAndBurn, executeDodgeAndBurnWithGradient, selectToolForDodgeAndBurn, setColorForDodgeAndBurn } from '../../../modules/actions/dodge-and-burn';
import { store, TState } from '../../../store';

interface State {
    currentTool: string,
    color: string
}

export class DodgeAndBurn extends StatefulComponent<{}, State> {

    @property currentTool: string;
    @property color: string;

    constructor(props: {}) {
        super(props);
        const state = store.getState();
        this.state = {
            currentTool: state.currentTool,
            color: 'gray'
        };
    }

    render() {

        const white: React.CSSProperties = {
            backgroundColor: 'white',
            color: 'black'
        };
        const gray: React.CSSProperties = {
            backgroundColor: 'gray',
            color: 'white'
        };
        const black: React.CSSProperties = {
            backgroundColor: 'black',
            color: 'white'
        };

        switch (this.color) {
            case 'white':
                white.outline = '2px solid red';
                break;
            case 'gray':
                gray.outline = '2px solid red';
                break;
            case 'black':
                black.outline = '2px solid red';
                break;
        }

        // Event functions
        const setColor = this.setColor.bind(this);

        return (
            <div className="section">
                <h3 className="title">Dodge and Burn</h3>
                <div id="dodge-and-burn">
                    <div className="flex stretch">
                        <sp-action-button onClick={this.excecuteWithGradient.bind(this)}># {i18next.t('dodgeAndBurn.gradient')}</sp-action-button>
                        <sp-action-button onClick={this.execute.bind(this)}>{i18next.t('dodgeAndBurn.default')}</sp-action-button>
                    </div>
                    <div className="flex stretch">
                        <sp-action-button data-color="white" style={white} onClick={setColor}>{i18next.t('dodgeAndBurn.white')}</sp-action-button>
                        <sp-action-button data-color="gray" style={gray} onClick={setColor}>{i18next.t('dodgeAndBurn.gray')}</sp-action-button>
                        <sp-action-button data-color="black" style={black} onClick={setColor}>{i18next.t('dodgeAndBurn.black')}</sp-action-button>
                    </div>
                    <div className="flex stretch">
                        <sp-action-button data-active={this.currentTool === 'paintbrushTool'} onClick={onBrushButtonClicked}>Brush</sp-action-button>
                        <sp-action-button data-active={this.currentTool === 'cloneStampTool'} onClick={onStampButtonClicked}>Stamp</sp-action-button>
                    </div>
                </div>
            </div>
        );
    }

    stateChanged(state: TState) {
        this.currentTool = state.currentTool;
    }

    private async execute() {

        if (!app.activeDocument) {
            return;
        }

        try {

            await core.executeAsModal(executeDodgeAndBurn, {
                commandName: 'Dodge And Burn'
            });

            this.color = 'white';

        } catch (err) {
            const message = err.message || err;
            app.showAlert(message);
        }

    }

    private async excecuteWithGradient() {

        if (!app.activeDocument) {
            return;
        }

        try {

            await core.executeAsModal(executeDodgeAndBurnWithGradient, {
                commandName: 'Dodge And Burn (With Gradient)'
            });

        } catch (err) {
            const message = err.message || err;
            app.showAlert(message);
        }

    }

    private async setColor(e: React.MouseEvent<HTMLButtonElement>) {
        try {

            const button = e.target as HTMLButtonElement;
            const colorCode = button.dataset.color;

            if (colorCode) {

                let grayscale = 128;
                if (colorCode === 'white') {
                    grayscale = 255;
                } else if (colorCode === 'black') {
                    grayscale = 0;
                }

                await core.executeAsModal(setColorForDodgeAndBurn(grayscale), {
                    commandName: 'Select Dodge And Burn Color ' + colorCode
                });

                this.color = colorCode;
            }
        } catch (err) {
            await app.showAlert(err);
        }
    }

}

async function onBrushButtonClicked() {
    try {

        await core.executeAsModal(selectToolForDodgeAndBurn('paintbrushTool'), {
            commandName: 'Select Dodge And Burn Brush'
        });

    } catch (err) {
        const message = err.message || err;
        app.showAlert(message);
    }

}
async function onStampButtonClicked() {
    try {

        await core.executeAsModal(selectToolForDodgeAndBurn('cloneStampTool'), {
            commandName: 'Select Dodge And Burn CloneStamp'
        });

    } catch (err) {
        const message = err.message || err;
        await app.showAlert(message);
    }
}