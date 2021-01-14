import { app } from 'photoshop'
import * as React from 'react'
import { ActionButton } from '@adobe/react-spectrum'
import i18next from 'i18next'

type Props = {
    isActive: boolean
}

export class SavePage extends React.Component<Props> {

    render() {
        
        const style: React.CSSProperties = {};
        if (!this.props.isActive) {
            style.display = 'none';
        }

        const width = app.activeDocument.width;
        const height = app.activeDocument.height;

        return <div className="page" style={style}>
            <div className="section">
                <h3>{i18next.t('savePage.currentPicture')}</h3>
                <div>
                    <span>{i18next.t('savePage.resolution')}</span>
                    <span>{width}x{height}</span>
                </div>
                <div>
                    <span>{i18next.t('savePage.pictureTypeLabel')}</span>
                    <span>JPG</span>
                </div>
            </div>
        </div>
    }

}