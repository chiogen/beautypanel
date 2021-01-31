import { app } from 'photoshop'
import * as React from 'react'
import i18next from 'i18next'
import { Heading } from '@adobe/react-spectrum';

type Props = {
    isActive: boolean
}

export class SavePage extends React.Component<Props> {

    render() {
        
        const style: React.CSSProperties = {};
        if (!this.props.isActive) {
            style.display = 'none';
        }

        const width = app.activeDocument?.width ?? 0;
        const height = app.activeDocument?.height ?? 0;

        return <div id="save" className="page" style={style}>
            <div className="section">
                <Heading>{i18next.t('savePage.currentPicture')}</Heading>
                <div>
                    <span>{i18next.t('savePage.resolution')}</span>
                    <span>{width}x{height}</span>
                </div>
                <div>
                    <span>{i18next.t('savePage.pictureTypeLabel')}</span>
                    <span>JPG</span>
                </div>
            </div>
            <div className="section">
                <Heading>{i18next.t('savePage.saveScaledCopyTo')}</Heading>
                <sp-action-button style={{display: 'flex' }}>{i18next.t('saveScaledButtonText')}</sp-action-button>
                <div>Output directory</div>
            </div>
            <div className="section">
                <Heading>{i18next.t('savePage.saveUnscaledCopyTo')}</Heading>
                <sp-action-button style={{display: 'flex' }}>{i18next.t('saveUnscaledButtonText')}</sp-action-button>
                <div>Output directory</div>
            </div>
        </div>;
    }

}