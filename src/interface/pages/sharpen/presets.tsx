import * as React from 'react'
import i18next from 'i18next';

const presetsStyle: React.CSSProperties = {
    display: 'flex'
}

export const Presets = () => 
    <div className="section">
        <h3 className="title">{i18next.t('sharpen.presets')}</h3>
        <div style={presetsStyle}>
            <sp-action-button>
                0.5
                <br />
                35%
            </sp-action-button>
            
            <sp-action-button>
                1
                <br />
                100%
            </sp-action-button>
            
            <sp-action-button>
                1.5
                <br />
                100%
            </sp-action-button>
            
            <sp-action-button>
                1
                <br />
                200%
            </sp-action-button>
            
            <sp-action-button>
                1.5
                <br />
                200%
            </sp-action-button>
            
            <sp-action-button>
                2
                <br />
                200%
            </sp-action-button>
        </div>
    </div>