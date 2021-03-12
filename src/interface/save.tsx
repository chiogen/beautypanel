import { app } from 'photoshop'
import * as React from 'react'
import i18next from 'i18next'
import { Heading } from '@adobe/react-spectrum';
import { property } from '../decorators/react-property';
import { Document } from 'photoshop';
import options from './save.json'
import { storage } from 'uxp';
import * as path from 'path';
import { shallowCompare } from '../common/shallow-compare';
import { addDocumentLoadedCallback } from '../common/active-document-observer';
import { getLastSavedFormat, getLastSavedPath, getLastScaleWidth, saveScaledCopy, saveUnscaledCopy } from '../modules/save';

const rFileSplit = /^(.+)\/([^\/]+)$/;

type P = {
    isActive: boolean
}
type S = {
    activeDocument: Document | null
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
    outputFolder: string
    messages: {
        quicksaveSuccess: string
        copySaveSuccess: string
    }
}

export class SavePage extends React.Component<P, S> {

    private _unregisterActiveDocumentObserver?: () => void

    isFrozen: boolean = false;
    texts: Texts

    @property activeDocument: Document | null;

    constructor(props: P) {
        super(props);
        this.texts = i18next.t('savePage', { returnObjects: true });
        this.state = {
            activeDocument: app.activeDocument
        };
    }

    componentDidMount() {
        super.componentDidMount?.call(this);

        this._unregisterActiveDocumentObserver = addDocumentLoadedCallback(() => {
            this.setState({
                activeDocument: app.activeDocument
            });
        });
    }
    componentWillUnmount() {
        if (this._unregisterActiveDocumentObserver) {
            this._unregisterActiveDocumentObserver();
            this._unregisterActiveDocumentObserver = undefined;
        }

        super.componentWillUnmount?.call(this);
    }

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, _nextContext: any): boolean {

        if (this.isFrozen) {
            return false;
        }

        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        try {

            const style: React.CSSProperties = {};
            if (!this.props.isActive) {
                style.display = 'none';
            }

            return (
                <div id="save" className="page" style={style}>
                    {this.renderCurrentPictureSection()}
                    {this.renderCopyPictureSection()}
                </div>
            );

        } catch (err) {
            return <>
                <h1>Save page failed to load:</h1>
                <p>{err.message}</p>
            </>;
        }
    }
    private renderCurrentPictureSection() {

        const activeDocument = app.activeDocument;
        const { texts } = this;

        const width = activeDocument?.width ?? 0;
        const height = activeDocument?.height ?? 0;

        const format = activeDocument?.path ? path.parse(activeDocument.path).ext : '';

        const quickSave = () => this.quickSave();
        const saveAs = () => this.saveAs();

        return (
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
                        <span>{format}</span>
                    </div>
                </div>
                <div className="actions">
                    <sp-action-button style={{ display: 'flex' }} onClick={quickSave}>{texts.save}</sp-action-button>
                    <sp-action-button style={{ display: 'flex' }} onClick={saveAs}>{texts.saveAs}</sp-action-button>
                </div>
            </div>
        )
    }
    private renderCopyPictureSection() {

        const { texts } = this;

        const format = getLastSavedFormat();
        const formatCode = format?._obj ?? '';
        const scaleWidth = String(getLastScaleWidth() ?? '');

        const saveFolder = getLastSavedPath();

        const saveUnscaledCopy = () => this.saveUnscaledCopy();
        const saveScaledCopy = () => this.saveScaledCopy();

        return (
            <div className="section">
                <Heading>{texts.saveScaledCopyTo}</Heading>
                <sp-action-button style={{ display: 'flex' }} onClick={saveScaledCopy}>
                    {texts.saveScaledButtonText} {formatCode} {scaleWidth}
                </sp-action-button>

                <Heading>{texts.saveUnscaledCopyTo}</Heading>
                <sp-action-button style={{ display: 'flex' }} onClick={saveUnscaledCopy}>
                    {texts.saveUnscaledButtonText} {formatCode}
                </sp-action-button>

                <div className="output-dir">
                    <span> {this.texts.outputFolder} {saveFolder} </span>
                </div>
            </div>
        )
    }

    private async quickSave() {
        try {

            if (!app.activeDocument) {
                return;
            }

            await app.activeDocument.save();
            await app.showAlert(this.texts.messages.quicksaveSuccess)

        } catch (err) {
            app.showAlert(err.message);
        }
    }

    private async saveAs() {

        const fs = storage.localFileSystem;

        try {

            if (!app.activeDocument) {
                return;
            }

            const document = app.activeDocument;
            const parsed = path.parse(document.path);

            const file = await fs.getFileForSaving(parsed.name + '.jpg');
            if (!file) {
                return;
            }

            await document.save(file);
            await app.showAlert(this.texts.messages.quicksaveSuccess)

        } catch (err) {
            app.showAlert(err.message);
        }

    }

    private async saveScaledCopy() {
        try {

            this.isFrozen = true;
            await saveScaledCopy();

            this.forceUpdate();

        } catch (err) {
            app.showAlert(err.message);
        } finally {
            this.isFrozen = false;
        }

    }
    private async saveUnscaledCopy() {
        try {

            this.isFrozen = true;
            await saveUnscaledCopy();

            this.forceUpdate();

        } catch (err) {
            app.showAlert(err.message);
        } finally {
            this.isFrozen = false;
        }
    }

}