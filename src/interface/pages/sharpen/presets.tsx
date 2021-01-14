import * as React from 'react'
import { ActionButton } from '@adobe/react-spectrum'
import i18next from 'i18next';

const presetsStyle: React.CSSProperties = {
    display: 'flex'
}

export const Presets = () => 
    <div className="section">
        <h3 className="title">{i18next.t('sharpen.presets')}</h3>
        <div style={presetsStyle}>
            <ActionButton>
                0.5
                <br />
                35%
            </ActionButton>
            
            <ActionButton>
                1
                <br />
                100%
            </ActionButton>
            
            <ActionButton>
                1.5
                <br />
                100%
            </ActionButton>
            
            <ActionButton>
                1
                <br />
                200%
            </ActionButton>
            
            <ActionButton>
                1.5
                <br />
                200%
            </ActionButton>
            
            <ActionButton>
                2
                <br />
                200%
            </ActionButton>
        </div>
    </div>