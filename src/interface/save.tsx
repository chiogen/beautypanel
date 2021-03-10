import { app } from 'photoshop'
import * as React from 'react'
import i18next from 'i18next'
import { Heading } from '@adobe/react-spectrum';
import { property } from '../decorators/react-property';
import { Document } from 'photoshop';
import options from './save.json'
import { storage } from 'uxp';
import * as path from 'path';
import { ActionDescriptor } from 'photoshop';
import { shallowCompare } from '../common/shallow-compare';
import { addDocumentLoadedCallback } from '../common/active-document-observer';
import { createFileToken } from '../common/app-utils';

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
    messages: {
        quicksaveSuccess: string
    }
}

export class SavePage extends React.Component<P, S> {

    private _unregisterActiveDocumentObserver?: () => void

    isFrozen: boolean = false;
    texts: Texts

    @property activeDocument: Document | null;


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

        const style: React.CSSProperties = {};
        if (!this.props.isActive) {
            style.display = 'none';
        }

        const activeDocument = app.activeDocument;
        const { texts } = this;

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

            const folder = await storage.localFileSystem.getFolder();

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

        try {

            if (!app.activeDocument) {
                return;
            }

            const document = app.activeDocument;

            let folder = this.outputFolder;
            if (!folder.endsWith('/')) {
                folder += '/';
            }

            const parsed = path.parse(document.path);
            const file = await storage.localFileSystem.getFileForSaving(parsed.name + '.jpg');
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

            if (!app.activeDocument) {
                return;
            }


            this.isFrozen = true;

            const document = app.activeDocument;

            const { name, ext } = path.parse(document.path);

            const folder = this.outputFolder;
            const filePath = path.join(folder, name + '_scaled' + ext);

            const sourceFileToken = createFileToken(document.path);
            const targetFileToken = createFileToken(filePath);

            // ToDO:
            // Duplicate current document
            const _saveCopy: ActionDescriptor = {
                _obj: "save",
                as: {
                    _obj: "JPEG",
                    extendedQuality: 12,
                    matteColor: {
                        _enum: "matteColor",
                        _value: "none"
                    }
                },
                in: {
                    _path: targetFileToken,
                    _kind: "local"
                },
                lowerCase: true,
                saveStage: {
                    _enum: "saveStageType",
                    _value: "saveSucceeded"
                }
            }
            const _openCopy: ActionDescriptor = {
                "_obj": "open",
                "null": {
                    "_path": targetFileToken,
                    "_kind": "local"
                }
            };

            // Scale document
            const _resizeCopy: ActionDescriptor = {

            };

            // Save scaled document
            const _saveScaledCopy: ActionDescriptor = {
                _obj: "save",
                as: {
                    _obj: "JPEG",
                    extendedQuality: 12,
                    matteColor: {
                        _enum: "matteColor",
                        _value: "none"
                    }
                },
                in: {
                    _path: targetFileToken,
                    _kind: "local"
                },
                lowerCase: true,
                saveStage: {
                    _enum: "saveStageType",
                    _value: "saveSucceeded"
                }
            };

            // Close document
            const _closeCopy: ActionDescriptor = {
                _obj: "close",
                documentID: app.activeDocument._id,
            };
            const _openSource: ActionDescriptor = {
                _obj: "open",
                "null": {
                    _path: sourceFileToken,
                    _kind: "local"
                }
            };

            const results = await app.batchPlay([
                _saveCopy,
                // _resizeCopy,
                // _saveScaledCopy,
                // _closeCopy,
                // _openSource
            ]);

            for (const result of results) {
                if (result.message) {
                    throw new Error(result.message);
                }
            }

            await app.showAlert(this.texts.messages.quicksaveSuccess);

        } catch (err) {
            app.showAlert(err.message);
        } finally {
            this.isFrozen = false;
        }

    }
    private async saveUnscaledCopy() {
        try {

            if (!app.activeDocument) {
                return;
            }

            this.isFrozen = true;

            const document = app.activeDocument;
            const { name, ext } = path.parse(document.path);

            const folder = this.outputFolder;
            const filePath = path.join(folder, name + '_scaled' + ext);

            const fileToken = storage.localFileSystem.createSessionToken({ isFile: true, isFolder: false, isEntry: true, name: filePath, nativePath: filePath });

            const _saveCopy: ActionDescriptor = {
                _obj: "save",
                as: {
                    _obj: "JPEG",
                    extendedQuality: 12,
                    matteColor: {
                        _enum: "matteColor",
                        _value: "none"
                    }
                },
                in: {
                    _path: fileToken,
                    _kind: "local"
                },
                documentID: document._id,
                lowerCase: true,
                saveStage: {
                    _enum: "saveStageType",
                    _value: "saveSucceeded"
                }
            }

            const [result] = await app.batchPlay([_saveCopy]);
            if (result.message) {
                throw new Error(result.message);
            }

            await app.showAlert(this.texts.messages.quicksaveSuccess);

        } catch (err) {
            app.showAlert(err.message);
        } finally {
            this.isFrozen = false;
        }
    }

}