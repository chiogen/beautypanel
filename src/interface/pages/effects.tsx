import i18next from 'i18next';
import * as React from 'react'

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
            <sp-action-button>{i18next.t('effects.enhanceDetails')}</sp-action-button>
            <sp-action-button>{i18next.t('effects.strengthenDetails')}</sp-action-button>
            <sp-action-button>{i18next.t('effects.orton')}</sp-action-button>
            <sp-action-button>{i18next.t('effects.vignette')}</sp-action-button>
            <sp-action-button>{i18next.t('effects.autumn')}</sp-action-button>
        </div>;
    }

}