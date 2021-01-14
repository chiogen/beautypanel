import i18next from 'i18next';
import * as React from 'react'
import { ActionButton } from '@adobe/react-spectrum'

type Props = {
    isActive: boolean
}

export class Effects extends React.Component<Props> {

    render() {
        
        const style: React.CSSProperties = {};
        if (!this.props.isActive) {
            style.display = 'none';
        }

        return <div className="page" style={style}>
            <ActionButton>{i18next.t('effects.enhanceDetails')}</ActionButton>
            <ActionButton>{i18next.t('effects.strengthenDetails')}</ActionButton>
            <ActionButton>{i18next.t('effects.orton')}</ActionButton>
            <ActionButton>{i18next.t('effects.vignette')}</ActionButton>
            <ActionButton>{i18next.t('effects.autumn')}</ActionButton>
        </div>;
    }

}