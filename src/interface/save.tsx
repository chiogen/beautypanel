import i18next from 'i18next';
import * as path from 'path';
import { basename } from 'path';
import { app, core } from 'photoshop';
import { Document } from 'photoshop/dom/Document';
import * as React from 'react';
import { addDocumentLoadedCallback } from '../common/active-document-observer';
import { handleException } from '../common/errors/handle-error';
import { getFileForSaving } from '../common/fs/get-file-for-saving';
import { replaceExtension } from '../common/path/replace-extension';
import { shallowCompare } from '../common/shallow-compare';
import { StatefulComponent } from '../components/base/stateful-component';
import { property } from '../decorators/react-property';
import { getLastScaleSize, save, saveScaledCopy, saveUnscaledCopy } from '../modules/actions/save';
import { store, TState } from '../store';
import { showMessageDialog } from '../ui/message-dialog';

type P = {
    isActive: boolean
};
type S = {
    activeDocument: Document | null
    preferredSaveFormat: string
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

export class SavePage extends StatefulComponent<P, S> {

    private _unregisterActiveDocumentObserver?: () => void;

    isFrozen = false;
    texts: Texts;

    @property activeDocument: Document | null;

    @property preferredSaveFormat: string;


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
            activeDocument: app.activeDocument,
            preferredSaveFormat: store.getState().save.preferredSaveFormat
        };
    }

    protected stateChanged(state: TState): void {
        this.preferredSaveFormat = state.save.preferredSaveFormat;
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

        const format = activeDocument?.path
            ? path.parse(activeDocument.path).ext
            : '';

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

        const { texts, preferredSaveFormat } = this;

        const scaleWidth = String(getLastScaleSize() ?? '');
        const saveFolder = this.copyOutputFolder;

        const saveUnscaledCopy = () => this.saveUnscaledCopy();
        const saveScaledCopy = () => this.saveScaledCopy();

        return (
            <div className="section">
                <h3>{texts.saveScaledCopyTo}</h3>
                <sp-action-button style={{ display: 'flex' }} onClick={saveScaledCopy}>
                    {texts.saveScaledButtonText} {preferredSaveFormat} {scaleWidth}
                </sp-action-button>

                <h3>{texts.saveUnscaledCopyTo}</h3>
                <sp-action-button style={{ display: 'flex' }} onClick={saveUnscaledCopy}>
                    {texts.saveUnscaledButtonText} {preferredSaveFormat}
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
            }, {
                commandName: 'Quicksave'
            });


        } catch (err) {
            await handleException(err);
        }
    }

    private async saveAs() {

        try {

            if (!app.activeDocument) {
                return;
            }

            const document = app.activeDocument;
            const documentFileName = basename(document.path);
            const suggestedFileName = replaceExtension(documentFileName, '.jpg');

            const file = await getFileForSaving(suggestedFileName);

            await core.executeAsModal(async () => {

                await save(document, file, true);

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