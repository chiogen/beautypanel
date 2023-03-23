import { app, core } from 'photoshop';
import * as React from 'react';
import i18next from 'i18next';
import { property } from '../decorators/react-property';
import { storage } from 'uxp';
import * as path from 'path';
import { shallowCompare } from '../common/shallow-compare';
import { addDocumentLoadedCallback } from '../common/active-document-observer';
import { getLastSavedFormat, getLastScaleSize, save, saveScaledCopy, saveUnscaledCopy } from '../modules/actions/save';
import { handleException } from '../common/errors/handle-error';
import { Document } from 'photoshop/dom/Document';
import { showMessageDialog } from '../ui/message-dialog';

type P = {
    isActive: boolean
};
type S = {
    activeDocument: Document | null
};

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
};

export class SavePage extends React.Component<P, S> {

    private _unregisterActiveDocumentObserver?: () => void;

    isFrozen = false;
    texts: Texts;

    @property activeDocument: Document | null;


    get copyOutputFolder() {
        if (app.activeDocument?.path) {
            return path.parse(app.activeDocument.path).dir;
        }
        return '';
    }

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

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>): boolean {

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
                <h3>{i18next.t('savePage.currentPicture')}</h3>
                <div id="document-information">
                    <div className="flex">
                        <span>{activeDocument?.path ?? ''}</span>
                    </div>
                    <div className="flex">
                        <span>{i18next.t('savePage.resolution')}</span>
                        <span>{width}x{height}</span>
                    </div>
                    <div className="flex">
                        <span>{i18next.t('savePage.pictureTypeLabel')}</span>
                        <span>{format}</span>
                    </div>
                </div>
                <div className="flex stretch">
                    <sp-action-button style={{ display: 'flex' }} onClick={quickSave}>{texts.save}</sp-action-button>
                    <sp-action-button style={{ display: 'flex' }} onClick={saveAs}>{texts.saveAs}</sp-action-button>
                </div>
            </div>
        );
    }
    private renderCopyPictureSection() {

        const { texts } = this;

        const format = getLastSavedFormat();
        const formatCode = format?._obj ?? '';
        const scaleWidth = String(getLastScaleSize() ?? '');

        const saveFolder = this.copyOutputFolder;

        const saveUnscaledCopy = () => this.saveUnscaledCopy();
        const saveScaledCopy = () => this.saveScaledCopy();

        return (
            <div className="section">
                <h3>{texts.saveScaledCopyTo}</h3>
                <sp-action-button style={{ display: 'flex' }} onClick={saveScaledCopy}>
                    {texts.saveScaledButtonText} {formatCode} {scaleWidth}
                </sp-action-button>

                <h3>{texts.saveUnscaledCopyTo}</h3>
                <sp-action-button style={{ display: 'flex' }} onClick={saveUnscaledCopy}>
                    {texts.saveUnscaledButtonText} {formatCode}
                </sp-action-button>

                <div className="output-dir flex">
                    <span> {this.texts.outputFolder} {saveFolder} </span>
                </div>
            </div>
        );
    }

    private async quickSave() {
        try {

            if (!app.activeDocument) {
                return;
            }

            await core.executeAsModal(async () => {
                await app.activeDocument.save();
                await showMessageDialog(this.texts.messages.quicksaveSuccess);
            }, {
                commandName: 'Quicksave'
            });


        } catch (err) {
            await handleException(err);
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

            await core.executeAsModal(async () => {

                await save(document, file);
                await showMessageDialog(this.texts.messages.copySaveSuccess);

            }, {
                commandName: 'Save As'
            });

        } catch (err) {
            await handleException(err);
        }

    }

    private async saveScaledCopy() {
        try {

            this.isFrozen = true;

            await core.executeAsModal(saveScaledCopy, {
                commandName: 'Save scaled copy'
            });

            this.forceUpdate();

        } catch (err) {
            await handleException(err);
        } finally {
            this.isFrozen = false;
        }

    }
    private async saveUnscaledCopy() {
        try {

            this.isFrozen = true;

            await core.executeAsModal(saveUnscaledCopy, {
                commandName: 'Save unscaled copy'
            });

            this.forceUpdate();

        } catch (err) {
            await handleException(err);
        } finally {
            this.isFrozen = false;
        }
    }

}