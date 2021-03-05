import { app } from 'photoshop'
import * as React from 'react'
import i18next from 'i18next'
import { Heading } from '@adobe/react-spectrum';
import { property } from '../decorators/react-property';
import { Document } from 'photoshop';
import { TState } from '../store';
import { ActionType } from '../store-action-types';
import options from './save.json'
import { storage } from 'uxp';
import * as path from '../common/path';

const rFileSplit = /^(.+)\/([^\/]+)$/;

type P = {
    isActive: boolean
}
type S = {
    activeDocument?: Document | null
}

type Texts = {
    resolution: string,
    pictureTypeLabel: string
    saveAs: string
    save: string
    saveScaledCopyTo: string
    saveScaledButtonText: string
    saveUnscaledCopyTo: string
    saveUnscaledButtonText: string
    messages: {
        quicksaveSuccess: string
    }
}

export class SavePage extends React.Component<P, S> {

    @property activeDocument: Document | null;
    texts: Texts

    get outputFolder() {
        let userConfigValue = localStorage.getItem('saveOutputFolder');
        if (userConfigValue) {
            return userConfigValue;
        }
        return options.defaultPaths.normal;
    }

    constructor(props: P) {
        super(props);
        this.texts = i18next.t('savePage', { returnObjects: true });
        this.state = {
            activeDocument: app.activeDocument
        };
    }

    render() {

        const style: React.CSSProperties = {};
        if (!this.props.isActive) {
            style.display = 'none';
        }

        const { texts, activeDocument } = this;

        const width = activeDocument?.width ?? 0;
        const height = activeDocument?.height ?? 0;

        const quickSave = () => this.quickSave();
        const saveAs = () => this.saveAs();
        const saveUnscaledCopy = () => this.saveUnscaledCopy();
        const saveScaledCopy = () => this.saveScaledCopy();

        return (
            <div id="save" className="page" style={style}>
                <div className="section">
                    <Heading>{i18next.t('savePage.currentPicture')}</Heading>
                    <div id="document-information">
                        <div>
                            <span>{activeDocument?.path ?? ''}</span>
                        </div>
                        <div>
                            <span>{i18next.t('savePage.resolution')}</span>
                            <span>{width}x{height}</span>
                        </div>
                        <div>
                            <span>{i18next.t('savePage.pictureTypeLabel')}</span>
                            <span>JPG</span>
                        </div>
                    </div>
                    <div id="default-save-buttons">
                        <sp-action-button style={{ display: 'flex' }} onClick={quickSave}>{texts.save}</sp-action-button>
                        <sp-action-button style={{ display: 'flex' }} onClick={saveAs}>{texts.saveAs}</sp-action-button>
                    </div>
                </div>
                <div className="section">
                    <Heading>{texts.saveScaledCopyTo}</Heading>
                    <sp-action-button style={{ display: 'flex' }} onClick={saveScaledCopy}># {texts.saveScaledButtonText}</sp-action-button>
                    <div className="output-dir">
                        <span>
                            Output directory:
                            <a onClick={this.selectOutputFolder.bind(this)}>{this.outputFolder}</a>
                        </span>
                    </div>
                </div>
                <div className="section">
                    <Heading>{texts.saveUnscaledCopyTo}</Heading>
                    <sp-action-button style={{ display: 'flex' }} onClick={saveUnscaledCopy}># {texts.saveUnscaledButtonText}</sp-action-button>
                    <div className="output-dir">
                        <span>
                            Output directory:
                            <a onClick={this.selectOutputFolder.bind(this)}>{this.outputFolder}</a>
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    private async selectOutputFolder() {
        try {

            const folder = await storage.localFileSystem.getFolder({});

            if (!folder) {
                return;
            }

            localStorage.setItem('saveOutputFolder', folder.name);
            this.forceUpdate();

        } catch (err) {
            app.showAlert(err.message);
        }
    }

    private async quickSave() {
        try {

            if (!this.activeDocument) {
                return;
            }

            await this.activeDocument.save();
            await app.showAlert(this.texts.messages.quicksaveSuccess)

        } catch (err) {
            app.showAlert(err.message);
        }
    }

    private async saveAs() {

        try {

            if (!this.activeDocument) {
                return;
            }

            let folder = this.outputFolder;
            if (!folder.endsWith('/')) {
                folder += '/';
            }

            const parsed = path.parse(this.activeDocument.path);
            const file = await storage.localFileSystem.getFileForSaving(parsed.name + '.jpg');
            if (!file) {
                return;
            }

            await this.activeDocument.save(file);
            await app.showAlert(this.texts.messages.quicksaveSuccess)

        } catch (err) {
            app.showAlert(err.message);
        }

    }

    private async saveScaledCopy() {
        try {

        } catch (err) {
            app.showAlert(err.message);
        }

    }
    private async saveUnscaledCopy() {
        try {

        } catch (err) {
            app.showAlert(err.message);
        }
    }

    stateChanged(state: TState) {
        if (state.lastAction.type === ActionType.DocumentChanged) {
            this.activeDocument = state.lastAction.document;
        }
    }

}